/* eslint-disable jsx-a11y/alt-text -- react-pdf's <Image> is not an HTML <img>; PDFs have no alt text */
import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatMoney } from '@/lib/money'
import { discountLabel, discountSignChar, rowDiscountCents, rowPriceAfterDiscountCents } from '@/lib/invoice'
import { linePeriodTexts } from '@/lib/rental'
import type { InvoiceDoc } from '@/lib/invoice-data'
import { keyPoints, parseTerms, TERMS_TITLE } from '@/lib/terms'

// Never split words with a hyphen: it would break email addresses across lines.
Font.registerHyphenationCallback((word) => [word])

const GOLD = '#B8941F'
const INK = '#1a1a1a'
const MUTED = '#666666'
const RULE = '#dddddd'

const s = StyleSheet.create({
  page: { paddingBottom: 60, fontFamily: 'Helvetica', fontSize: 10, color: INK },
  band: { backgroundColor: '#000000', paddingHorizontal: 40, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { height: 48, objectFit: 'contain' },
  bandName: { color: '#ffffff', fontSize: 16, fontFamily: 'Helvetica-Bold' },
  title: { color: '#D4AF37', fontSize: 24, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  number: { color: '#ffffff', fontSize: 11, textAlign: 'right', marginTop: 2 },
  body: { paddingHorizontal: 40, paddingTop: 22 },
  cols: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  col: { width: '48%' },
  label: { fontSize: 8, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 },
  strong: { fontFamily: 'Helvetica-Bold' },
  line: { marginBottom: 1.5 },
  muted: { color: MUTED },
  th: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: INK, paddingBottom: 5, fontSize: 8, fontFamily: 'Helvetica-Bold', color: MUTED },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: RULE, paddingVertical: 6 },
  cItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 30, height: 30, borderRadius: 3, marginRight: 8 },
  cQty: { width: 36, textAlign: 'center' },
  cPrice: { width: 70, textAlign: 'right' },
  cAmt: { width: 80, textAlign: 'right' },
  totals: { marginTop: 14, marginLeft: 'auto', width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2.5 },
  grand: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: INK, marginTop: 4, paddingTop: 6, fontSize: 13, fontFamily: 'Helvetica-Bold' },
  notes: { marginTop: 22 },
  keyTerms: { marginTop: 20, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#faf8f0', borderLeftWidth: 3, borderLeftColor: '#D4AF37' },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { width: 10 },
  termsTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 12 },
  termsHead: { fontFamily: 'Helvetica-Bold', fontSize: 10, marginTop: 8, marginBottom: 2 },
  termsLine: { fontSize: 9.5, marginBottom: 3, lineHeight: 1.2 },
  signArea: { marginTop: 34, flexDirection: 'row', gap: 24 },
  signCol: { flex: 1 },
  signImg: { height: 48, objectFit: 'contain', objectPosition: 'left' },
  signTyped: { fontFamily: 'Times-Italic', fontSize: 26, height: 48 },
  signLine: { borderTopWidth: 1, borderTopColor: INK, paddingTop: 4, fontSize: 8, color: MUTED },
  signOnline: { height: 48, justifyContent: 'center', paddingHorizontal: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: GOLD, borderRadius: 3, backgroundColor: '#f6f3e8' },
  itemRental: { fontSize: 8.5, color: '#2e7d32', fontFamily: 'Helvetica-Bold', marginTop: 1 },
  discountRow: { fontSize: 9, color: '#2e7d32', fontFamily: 'Helvetica-Bold' },
  link: { color: '#8a6d12', textDecoration: 'underline', fontFamily: 'Helvetica-Bold' },
  cert: { marginTop: 8, fontSize: 7.5, color: MUTED, lineHeight: 1.4 },
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: MUTED },
})

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

const textLines = (v: string) => v.split('\n').map((l) => l.trim()).filter(Boolean)

type Props = {
  doc: InvoiceDoc
  logo: Buffer | null
  thumbs: Record<string, Buffer | null> // line id -> jpeg
  customerSignature: Buffer | null // PNG of the customer's signature, once signed
  ownerSignature: Buffer | null // PNG of the owner's saved signature
  signUrl?: string // where the customer signs, while unsigned
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Toronto' }) + ' (Toronto time)'
}

export default function InvoicePdf({ doc, logo, thumbs, customerSignature, ownerSignature, signUrl }: Props) {
  const b = doc.settings
  const t = doc.totals
  return (
    <Document title={`Invoice ${doc.number} - ${b.business_name}`} author={b.business_name}>
      <Page size="LETTER" style={s.page}>
        <View style={s.band}>
          {logo ? <Image src={logo} style={s.logo} /> : <Text style={s.bandName}>{b.business_name}</Text>}
          <View>
            <Text style={s.title}>INVOICE</Text>
            <Text style={s.number}>#{doc.number}</Text>
          </View>
        </View>

        <View style={s.body}>
          <View style={s.cols}>
            <View style={s.col}>
              <Text style={s.label}>FROM</Text>
              <Text style={[s.line, s.strong]}>{b.business_name}</Text>
              {textLines(b.address).map((l, i) => <Text key={i} style={s.line}>{l}</Text>)}
              {!!b.phone && <Text style={s.line}>{b.phone}</Text>}
              {!!b.email && <Text style={s.line}>{b.email}</Text>}
              {!!b.tax_number && <Text style={[s.line, s.muted]}>{b.tax_label} #: {b.tax_number}</Text>}
            </View>
            <View style={s.col}>
              <Text style={s.label}>BILL TO</Text>
              <Text style={[s.line, s.strong]}>{doc.customer_name || ' '}</Text>
              {!!doc.customer_email && <Text style={s.line}>{doc.customer_email}</Text>}
              {textLines(doc.customer_address).map((l, i) => <Text key={i} style={s.line}>{l}</Text>)}
              <Text style={[s.line, { marginTop: 8 }]}>
                <Text style={s.muted}>Invoice date: </Text>{formatDate(doc.issue_date)}
              </Text>
              {!!doc.due_date && (
                <Text style={s.line}><Text style={s.muted}>Due date: </Text>{formatDate(doc.due_date)}</Text>
              )}
            </View>
          </View>

          <View style={s.th} fixed>
            <Text style={{ flex: 1 }}>ITEM</Text>
            <Text style={s.cQty}>QTY</Text>
            <Text style={s.cPrice}>PRICE</Text>
            <Text style={s.cAmt}>AMOUNT</Text>
          </View>
          {doc.lines.map((l) => {
            const thumb = thumbs[l.id]
            const off = rowDiscountCents(l)
            return (
              <View key={l.id} wrap={false}>
                <View style={off > 0 ? [s.row, { borderBottomWidth: 0, paddingBottom: 3 }] : s.row}>
                  <View style={s.cItem}>
                    {thumb && <Image src={thumb} style={s.thumb} />}
                    <View style={{ flex: 1 }}>
                      <Text>{l.name}</Text>
                      {linePeriodTexts(l, doc).map((p, i) => <Text key={i} style={s.itemRental}>{p}</Text>)}
                      {!!l.description && l.description !== l.name && <Text style={[s.muted, { fontSize: 8 }]}>{l.description}</Text>}
                    </View>
                  </View>
                  <Text style={s.cQty}>{l.quantity}</Text>
                  <Text style={s.cPrice}>{formatMoney(l.unit_price_cents)}</Text>
                  <Text style={s.cAmt}>{formatMoney(l.unit_price_cents * l.quantity)}</Text>
                </View>
                {off > 0 && (
                  <View style={[s.row, { paddingTop: 0, paddingBottom: 2, borderBottomWidth: 0 }]}>
                    <View style={[s.cItem, { paddingLeft: thumb ? 38 : 0 }]}>
                      <Text style={s.discountRow}>{discountLabel(l)}</Text>
                    </View>
                    <Text style={s.cQty} />
                    <Text style={s.cPrice} />
                    <Text style={[s.cAmt, s.discountRow]}>{discountSignChar(l)}{formatMoney(off)}</Text>
                  </View>
                )}
                {off > 0 && (
                  <View style={[s.row, { paddingTop: 0 }]}>
                    <View style={[s.cItem, { paddingLeft: thumb ? 38 : 0 }]}>
                      <Text style={s.discountRow}>Price after discount</Text>
                    </View>
                    <Text style={s.cQty} />
                    <Text style={s.cPrice} />
                    <Text style={[s.cAmt, s.discountRow]}>{formatMoney(rowPriceAfterDiscountCents(l))}</Text>
                  </View>
                )}
              </View>
            )
          })}

          <View style={s.totals} wrap={false}>
            <View style={s.totalRow}><Text style={s.muted}>Subtotal</Text><Text>{formatMoney(t.subtotal)}</Text></View>
            {t.discount > 0 && <View style={s.totalRow}><Text style={s.muted}>Discount</Text><Text>-{formatMoney(t.discount)}</Text></View>}
            {doc.apply_tax && <View style={s.totalRow}><Text style={s.muted}>{b.tax_label} ({doc.tax_rate}%)</Text><Text>{formatMoney(t.tax)}</Text></View>}
            <View style={s.grand}><Text>Total</Text><Text>{formatMoney(t.total)}</Text></View>
          </View>

          {!!doc.notes && (
            <View style={s.notes} wrap={false}>
              <Text style={s.label}>NOTES</Text>
              {textLines(doc.notes).map((l, i) => <Text key={i} style={s.line}>{l}</Text>)}
            </View>
          )}

          {!!doc.terms_text && (
            <View style={s.keyTerms} wrap={false}>
              <Text style={s.label}>KEY TERMS</Text>
              {keyPoints(doc.terms_key_points).map((k, i) => (
                <View key={i} style={s.bullet}><Text style={s.bulletDot}>•</Text><Text style={{ flex: 1 }}>{k}</Text></View>
              ))}
              <Text style={[s.strong, { marginTop: 4 }]}>
                By signing, you agree to this invoice and to the full Payment Terms on the next page.
              </Text>
            </View>
          )}

          <View wrap={false}>
            <View style={s.signArea}>
              <View style={s.signCol}>
                {doc.signature ? (
                  customerSignature ? <Image src={customerSignature} style={s.signImg} /> : <Text style={s.signTyped}>{doc.signature.name}</Text>
                ) : (
                  <View style={s.signOnline}>
                    {signUrl ? (
                      <Text>Review and sign this invoice online: <Link src={signUrl} style={s.link}>Open secure signing page</Link></Text>
                    ) : (
                      <Text style={s.muted}>A secure link to sign this invoice online is included when it is sent.</Text>
                    )}
                  </View>
                )}
                <Text style={s.signLine}>
                  {doc.signature ? `Customer: ${doc.signature.name}` : 'Customer signature'}
                </Text>
              </View>
              {doc.owner_signature && (
                <View style={s.signCol}>
                  {ownerSignature ? <Image src={ownerSignature} style={s.signImg} /> : <Text style={s.signTyped}>{b.business_name}</Text>}
                  <Text style={s.signLine}>Authorized: {b.business_name}</Text>
                </View>
              )}
            </View>
            {doc.signature && (
              <Text style={s.cert}>
                Electronically signed by {doc.signature.name} on {formatDateTime(doc.signature.signedAt)}.
                {doc.signature.ip ? ` IP address ${doc.signature.ip}.` : ''}
                {doc.signature.hash ? ` Document ID ${doc.signature.hash.slice(0, 16).toUpperCase()}.` : ''}
                {' '}The signer agreed to this invoice{doc.terms_text ? ' and the attached payment terms' : ''} and that this electronic signature has the same effect as a handwritten one.
              </Text>
            )}
          </View>
        </View>

        <Text style={s.footer} fixed render={({ pageNumber, totalPages }) =>
          `${b.invoice_footer ? b.invoice_footer + '  |  ' : ''}Page ${pageNumber} of ${totalPages}`
        } />
      </Page>

      {!!doc.terms_text && (
        <Page size="LETTER" style={s.page}>
          <View style={s.body}>
            <Text style={s.label}>INVOICE #{doc.number}</Text>
            <Text style={s.termsTitle}>{TERMS_TITLE}</Text>
            {parseTerms(doc.terms_text).map((blk, i) => (
              <View key={i}>
                {!!blk.heading && <Text style={s.termsHead}>{blk.heading}</Text>}
                {blk.lines.map((l, j) => <Text key={j} style={s.termsLine}>{l}</Text>)}
              </View>
            ))}
          </View>
          <Text style={s.footer} fixed render={({ pageNumber, totalPages }) =>
            `${b.invoice_footer ? b.invoice_footer + '  |  ' : ''}Page ${pageNumber} of ${totalPages}`
          } />
        </Page>
      )}
    </Document>
  )
}
