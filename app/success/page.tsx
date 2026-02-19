export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Booking Confirmed! 🎉</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your booking. We'll be in touch shortly to confirm your event details.
      </p>
      <a href="/inventory" className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition">
        Back to Inventory
      </a>
    </div>
  )
}
