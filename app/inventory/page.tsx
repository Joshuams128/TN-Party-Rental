import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inventory | True North Party Rentals',
  description: 'Browse our extensive inventory of event rental equipment including tables, chairs, linens, décor, and more.',
}

export default function InventoryPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Rental Inventory</h1>
        <p className="text-xl text-gray-600 mb-12">
          Browse our extensive collection of high-quality event equipment and décor
        </p>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="Tables"
            items={['Round Tables', 'Rectangle Tables', 'Cocktail Tables', 'Farm Tables']}
          />
          <CategoryCard
            title="Chairs"
            items={['Chiavari Chairs', 'Folding Chairs', 'Ghost Chairs', 'Bar Stools']}
          />
          <CategoryCard
            title="Linens"
            items={['Tablecloths', 'Table Runners', 'Napkins', 'Chair Covers']}
          />
          <CategoryCard
            title="Tents & Canopies"
            items={['Frame Tents', 'Pole Tents', 'Pop-up Canopies', 'Sidewalls']}
          />
          <CategoryCard
            title="Décor"
            items={['Centerpieces', 'Lighting', 'Backdrops', 'Floral Arrangements']}
          />
          <CategoryCard
            title="Serving Equipment"
            items={['Chafing Dishes', 'Beverage Dispensers', 'Serving Platters', 'Glassware']}
          />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-600 mb-6">
            Our team can help you select the perfect items for your event
          </p>
          <a
            href="/contact"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-2xl font-semibold mb-4 text-gold">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
