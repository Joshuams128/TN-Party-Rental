/* eslint-disable jsx-a11y/alt-text -- react-pdf's <Image> is not an HTML <img>; PDFs have no alt text */
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatMoney } from '@/lib/money'
import type { InvoiceDoc } from '@/lib/invoice-data'

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
  sign: { marginTop: 46, flexDirection: 'row', justifyContent: 'space-between' },
  signBox: { width: '58%' },
  signDate: { width: '34%' },
  signLine: { borderTopWidth: 1, borderTopColor: INK, paddingTop: 4, fontSize: 8, color: MUTED },
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
}

export default function InvoicePdf({ doc, logo, thumbs }: Props) {
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
            return (
              <View key={l.id} style={s.row} wrap={false}>
                <View style={s.cItem}>
                  {thumb && <Image src={thumb} style={s.thumb} />}
                  <View style={{ flex: 1 }}>
                    <Text>{l.name}</Text>
                    {!!l.description && l.description !== l.name && <Text style={[s.muted, { fontSize: 8 }]}>{l.description}</Text>}
                  </View>
                </View>
                <Text style={s.cQty}>{l.quantity}</Text>
                <Text style={s.cPrice}>{formatMoney(l.unit_price_cents)}</Text>
                <Text style={s.cAmt}>{formatMoney(l.unit_price_cents * l.quantity)}</Text>
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

          <View wrap={false}>
            <View style={s.sign}>
              <View style={s.signBox}><Text style={s.signLine}>Customer signature</Text></View>
              <View style={s.signDate}><Text style={s.signLine}>Date</Text></View>
            </View>
            {doc.owner_signature && (
              <View style={[s.sign, { marginTop: 36 }]}>
                <View style={s.signBox}><Text style={s.signLine}>Authorized signature - {b.business_name}</Text></View>
                <View style={s.signDate}><Text style={s.signLine}>Date</Text></View>
              </View>
            )}
          </View>
        </View>

        <Text style={s.footer} fixed render={({ pageNumber, totalPages }) =>
          `${b.invoice_footer ? b.invoice_footer + '  |  ' : ''}Page ${pageNumber} of ${totalPages}`
        } />
      </Page>
    </Document>
  )
}
