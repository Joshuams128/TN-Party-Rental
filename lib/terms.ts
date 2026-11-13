// Payment terms shown with every invoice: a short "key terms" box on the invoice itself, plus the full text
// (opened from "Please read full terms here" and printed as the second part of the PDF).

export type TermsBlock = { heading: string | null; lines: string[] }

// Blank-line separated blocks. A first line such as "2. Final Payment" is a heading; "•" lines are bullets.
export function parseTerms(text: string): TermsBlock[] {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((l) => l.length > 0)
    .map((lines) => {
      const isHeading = /^\d+\.\s+\S/.test(lines[0]) && lines[0].length <= 80
      return { heading: isHeading ? lines[0] : null, lines: isHeading ? lines.slice(1) : lines }
    })
}

// Key terms are one short point per line ("•" or "-" at the start is optional).
export const keyPoints = (text: string): string[] =>
  text.split('\n').map((l) => l.replace(/^\s*[•\-*]\s*/, '').trim()).filter(Boolean)

// Anything still in [square brackets] is a blank the owner must decide (e.g. "[e-Transfer / credit card / cash — confirm]").
export const termsPlaceholders = (text: string): string[] => text.match(/\[[^\]]*\]/g) ?? []

export const DEFAULT_KEY_POINTS = `A 50% non-refundable deposit is required to accept this quotation and reserve your date.
The remaining 50% balance is due 7 days before your event.
Cancel more than 7 days before: the deposit is kept. Within 7 days: all payments are non-refundable.
You are responsible for the rented equipment from delivery until pickup.`

export const DEFAULT_TERMS = `1. Booking Confirmation & Deposit
A deposit of fifty percent (50%) of the total quoted amount is required to accept the quotation and reserve your event date. Your booking is confirmed only once the deposit has been received and a written confirmation has been issued by True North Party Rentals.
The deposit is non-refundable. It reflects a reasonable pre-estimate of the costs and lost business True North Party Rentals incurs by reserving equipment, inventory, staff and delivery capacity exclusively for your event and turning away other bookings for that date.

2. Final Payment
The remaining fifty percent (50%) balance is due no later than seven (7) days before the scheduled event date. All amounts must be paid in full before delivery or setup.
If the balance is not received by the due date, True North Party Rentals may treat the booking as cancelled by the client and retain the deposit.
All prices are subject to applicable HST. Accepted payment methods: [e-Transfer / credit card / cash — confirm].

3. Cancellation by the Client
All cancellations must be submitted in writing (email is acceptable) and take effect on the date received.
• More than seven (7) days before the event: the deposit is retained. Any amount paid beyond the deposit will be refunded within [14] days.
• Within seven (7) days of the event: all payments made are non-refundable, except where required by applicable law.

4. Changes & Rescheduling
Requests to change or reschedule an event must be made in writing and are subject to availability and approval by True North Party Rentals. Where a new date is approved and booked within [six (6) months] of the original date, the deposit will be applied to the rescheduled event. Additional charges may apply for changes to the order, date, location or setup requirements.

5. Cancellation by True North Party Rentals
If True North Party Rentals is unable to provide the booked services for reasons within its control, the client will receive a full refund of all amounts paid. If services are prevented by events beyond its reasonable control (including severe weather, emergencies or government orders), True North Party Rentals will offer a rescheduled date or a credit toward a future booking.

6. Equipment Care, Damage & Loss
The client is responsible for rented equipment from delivery until pickup. Items that are lost, stolen or damaged beyond normal wear will be charged at repair or replacement cost. True North Party Rentals may require a refundable security deposit, which will be returned within [7] days of pickup, less any such charges.

7. Agreement
By signing below and submitting the deposit, the client confirms that they have read, understood and agree to these payment terms and cancellation policy. These terms are governed by the laws of the Province of Ontario, and nothing in them limits any rights the client has under Ontario consumer protection law.`

export const TERMS_TITLE = 'Payment Terms, Deposits & Cancellation Policy'
