'use client'

import { useState, FormEvent } from 'react'
import { productDetails } from '@/lib/inventory-data'
import { ChevronDown, X } from 'lucide-react'

// ── Area of Interest categories ──────────────────────────────────────────
// Each category has sub-items the user can pick from.

// 1. Inventory Items – built from the detailed inventory data
const inventorySubItems = productDetails.map((p) => ({
  slug: p.slug,
  name: p.name,
  options:
    p.pricingType === 'tiered'
      ? (p.tiers ?? []).map((t) => `${t.label} – ${t.price}`)
      : p.pricingType === 'variants'
      ? (p.variants ?? []).map((v) => `${v.name} – ${v.price}`)
      : [],
}))

// 2. Event Packages
const eventPackageSubItems = [
  { slug: 'pkg-intimate', name: 'Intimate Gathering', options: [] },
  { slug: 'pkg-celebration', name: 'Celebration Package', options: [] },
  { slug: 'pkg-premium-wedding', name: 'Premium Wedding', options: [] },
  { slug: 'pkg-corporate-event', name: 'Corporate Event', options: [] },
  { slug: 'pkg-ultimate', name: 'Ultimate Experience', options: [] },
]

// 3. Corporate Packages
const corporateSubItems = [
  { slug: 'corp-essential', name: 'Essential Package', options: [] },
  { slug: 'corp-professional', name: 'Professional Package', options: [] },
  { slug: 'corp-executive', name: 'Executive Package', options: [] },
]

type SubItem = { slug: string; name: string; options: string[] }

const interestCategories: { id: string; label: string; items: SubItem[] }[] = [
  { id: 'inventory', label: 'Inventory Items', items: inventorySubItems },
  { id: 'event-packages', label: 'Event Packages', items: eventPackageSubItems },
  { id: 'corporate', label: 'Corporate Packages', items: corporateSubItems },
]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    message: '',
  })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [customItemText, setCustomItemText] = useState('')
  const [selectedVariants, setSelectedVariants] = useState<string[]>([])
  const [addedItems, setAddedItems] = useState<{ id: string; category: string; name: string; variants: string[] }[]>([])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const activeCategory = interestCategories.find((c) => c.id === selectedCategory)
  const activeProduct = activeCategory?.items.find((p) => p.slug === selectedProduct)

  const handleVariantToggle = (option: string) => {
    setSelectedVariants((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
    )
  }

  const handleAddItem = () => {
    if (!selectedProduct) return
    const itemName = selectedProduct === 'other' ? customItemText : activeProduct?.name
    if (!itemName) return
    const categoryLabel = activeCategory?.label || 'Other'

    const newItem = {
      id: `${selectedProduct}-${Date.now()}`,
      category: categoryLabel,
      name: itemName,
      variants: selectedVariants,
    }
    setAddedItems([...addedItems, newItem])
    setSelectedProduct('')
    setCustomItemText('')
    setSelectedVariants([])
  }

  const handleRemoveItem = (id: string) => {
    setAddedItems(addedItems.filter((item) => item.id !== id))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          addedItems: addedItems.map((item) => ({
            category: item.category,
            name: item.name,
            variants: item.variants,
          })),
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          guestCount: '',
          message: '',
        })
        setSelectedCategory('')
        setSelectedProduct('')
        setCustomItemText('')
        setSelectedVariants([])
        setAddedItems([])
      } else {
        const data = await response.json()
        setStatus('error')
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Network error. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
          placeholder="John Doe"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
          placeholder="john@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
          placeholder="(416) 555-1234"
        />
      </div>

      {/* Event Type */}
      <div>
        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
          Event Type *
        </label>
        <select
          id="eventType"
          name="eventType"
          required
          value={formData.eventType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
        >
          <option value="">Select an event type</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate Event</option>
          <option value="birthday">Birthday Party</option>
          <option value="anniversary">Anniversary</option>
          <option value="graduation">Graduation</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Area of Interest */}
      <div>
        <label htmlFor="interestCategory" className="block text-sm font-medium text-gray-700 mb-1">
          Area of Interest
        </label>
        <div className="relative">
          <select
            id="interestCategory"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedProduct('')
              setCustomItemText('')
              setSelectedVariants([])
            }}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent appearance-none text-black"
          >
            <option value="">Select an area (optional)</option>
            {interestCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Sub-item dropdown – shown when a category is selected */}
      {selectedCategory && (
        <div>
          <label htmlFor="interestedItem" className="block text-sm font-medium text-gray-700 mb-1">
            Select Item / Package
          </label>
          <div className="relative">
            <select
              id="interestedItem"
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value)
                setCustomItemText('')
                setSelectedVariants([])
              }}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent appearance-none text-black"
            >
              <option value="">Select an option</option>
              {activeCategory?.items.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
              <option value="other">Other (please specify)</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Custom item text input — shown when "Other" is selected */}
      {selectedProduct === 'other' && (
        <div>
          <label htmlFor="customItem" className="block text-sm font-medium text-gray-700 mb-1">
            Please describe the item *
          </label>
          <input
            type="text"
            id="customItem"
            value={customItemText}
            onChange={(e) => setCustomItemText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
            placeholder="e.g., custom decorations, special equipment, etc."
          />
        </div>
      )}

      {/* Variant multi-select — shown only when the selected product (not "other") has options */}
      {activeProduct && activeProduct.options.length > 0 && selectedProduct !== 'other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Options <span className="text-gray-400 font-normal">(choose all that apply)</span>
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {activeProduct.options.map((option) => {
              const checked = selectedVariants.includes(option)
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    checked ? 'bg-amber-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                      checked
                        ? 'bg-[var(--color-gold)] border-[var(--color-gold)]'
                        : 'border-gray-300'
                    }`}
                    onClick={() => handleVariantToggle(option)}
                  >
                    {checked && (
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm text-gray-700 flex-1"
                    onClick={() => handleVariantToggle(option)}
                  >
                    {option}
                  </span>
                </label>
              )
            })}
          </div>
          {selectedVariants.length > 0 && (
            <p className="text-xs text-[var(--color-gold)] mt-2 font-medium">
              {selectedVariants.length} option{selectedVariants.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      )}

      {/* Add Item Button */}
      {selectedProduct && (
        <button
          type="button"
          onClick={handleAddItem}
          className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Add Item to Request
        </button>
      )}

      {/* Added Items List */}
      {addedItems.length > 0 && (
        <div className="border-2 border-[var(--color-gold)]/30 rounded-lg overflow-hidden bg-amber-50">
          <div className="bg-gradient-to-r from-[var(--color-gold)]/20 to-transparent px-4 py-3 border-b border-[var(--color-gold)]/20">
            <p className="font-semibold text-gray-800 text-sm">
              Items Requested ({addedItems.length})
            </p>
          </div>
          <div className="divide-y divide-[var(--color-gold)]/20">
            {addedItems.map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-start justify-between gap-3 hover:bg-amber-100/50 transition-colors">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.category}</p>
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  {item.variants.length > 0 && (
                    <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                      {item.variants.map((v, idx) => (
                        <li key={idx} className="ml-2">• {v}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remove item"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Date */}
      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
          Event Date
        </label>
        <input
          type="date"
          id="eventDate"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
        />
      </div>

      {/* Guest Count */}
      <div>
        <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Guest Count
        </label>
        <input
          type="number"
          id="guestCount"
          name="guestCount"
          value={formData.guestCount}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
          placeholder="50"
          min="1"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-black"
          placeholder="Tell us about your event and what you need..."
        />
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Thank you! We&apos;ve received your message and will contact you within 24 hours.
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-gold hover:bg-gold-dark text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
