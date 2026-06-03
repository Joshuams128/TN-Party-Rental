'use client'

import { Search, X, Package } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { inventoryItems } from './Inventory';
import { packages } from './Packages';
import { productDetails, slugify } from '@/lib/inventory-data';

interface SearchBarProps {
  /** Called after a result is selected (used to close the mobile menu). */
  onNavigate?: () => void;
  /** Render as a search icon that expands into an input when clicked (desktop). */
  expandable?: boolean;
}

type SearchEntry = {
  key: string;
  name: string;
  label: string;
  image?: string;
  href: string;
  haystack: string;
};

// Combined, searchable index of inventory items + packages. Each entry links
// back to its card on the relevant page (which then scrolls to it).
const searchIndex: SearchEntry[] = [
  ...inventoryItems.map((i) => ({
    key: `inv-${i.slug}`,
    name: i.name,
    label: i.category.replace(/-/g, ' '),
    image: i.image,
    href: `/inventory?item=${i.slug}`,
    haystack: [i.name, i.category, i.description, ...(i.features ?? [])]
      .join(' ')
      .toLowerCase(),
  })),
  ...packages.map((p) => ({
    key: `pkg-${p.id}`,
    name: p.name,
    label: 'Package',
    href: `/packages?pkg=${p.id}`,
    haystack: [p.name, p.subtitle, p.price, ...(p.features ?? []), ...(p.addons ?? [])]
      .join(' ')
      .toLowerCase(),
  })),
  // Every individual variant (e.g. "Shimmer Backdrop Package - Gold",
  // "Velvet Ropes") links to its exact card on the product detail page.
  ...productDetails.flatMap((p) =>
    (p.variants ?? []).map((v) => ({
      key: `var-${p.slug}-${slugify(v.name)}`,
      name: v.name,
      label: p.name,
      image: v.image,
      href: `/inventory/${p.slug}?v=${slugify(v.name)}`,
      haystack: [v.name, v.description ?? '', p.name].join(' ').toLowerCase(),
    }))
  ),
];

// De-duplicate variants that share the same name + parent (a few appear in
// more than one product), keeping the first occurrence.
const seen = new Set<string>();
const dedupedIndex = searchIndex.filter((e) => {
  const id = `${e.label}::${e.name}`;
  if (seen.has(id)) return false;
  seen.add(id);
  return true;
});

export function SearchBar({ onNavigate, expandable }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false); // results dropdown
  const [expanded, setExpanded] = useState(!expandable); // input visible
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const q = query.trim().toLowerCase();
  const results =
    q.length === 0 ? [] : dedupedIndex.filter((e) => e.haystack.includes(q)).slice(0, 8);

  const collapse = () => {
    setOpen(false);
    if (expandable) {
      setExpanded(false);
      setQuery('');
    }
  };

  // Close (and collapse) when clicking outside the component.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        collapse();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandable]);

  const toggle = () => {
    if (expanded) {
      collapse();
    } else {
      setExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  const select = (entry: SearchEntry) => {
    setQuery('');
    setOpen(false);
    if (expandable) setExpanded(false);
    onNavigate?.();
    router.push(entry.href);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      select(results[0]);
    }
  };

  const dropdown = open && q.length > 0 && (
    <div
      className={`absolute top-full mt-2 bg-[var(--color-gray-dark)] border border-[var(--color-gold)] border-opacity-30 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto ${
        expandable ? 'right-0 w-72' : 'left-0 right-0'
      }`}
    >
      {results.length > 0 ? (
        results.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => select(entry)}
            className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-[var(--color-gold)] hover:bg-opacity-10 transition-colors duration-200"
          >
            {entry.image ? (
              <Image
                src={entry.image}
                alt={entry.name}
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-md object-cover bg-black/40"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
                <Package size={18} />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-sm text-white truncate">{entry.name}</span>
              <span className="block text-xs text-gray-400 capitalize truncate">{entry.label}</span>
            </span>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-sm text-gray-400">
          No matches for &ldquo;{query}&rdquo;. Keep typing or edit your search.
        </div>
      )}
    </div>
  );

  // ─── Expandable icon (desktop navbar) ─────────────────────────────────────
  if (expandable) {
    return (
      <div ref={containerRef} className="relative flex items-center">
        <button
          type="button"
          onClick={toggle}
          aria-label={expanded ? 'Close search' : 'Open search'}
          className="text-white hover:text-[var(--color-gold)] transition-colors duration-300 shrink-0"
        >
          {expanded ? <X size={22} /> : <Search size={22} />}
        </button>

        <form onSubmit={handleSubmit}>
          <div
            className={`relative overflow-hidden transition-all duration-300 ease-out ${
              expanded ? 'w-52 ml-2 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') collapse();
              }}
              placeholder="Search rentals..."
              aria-label="Search rentals"
              tabIndex={expanded ? 0 : -1}
              className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-4 pr-9 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-gold)] focus:bg-white/15 transition-colors duration-300"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setOpen(false);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>

        {dropdown}
      </div>
    );
  }

  // ─── Always-open input (mobile menu) ──────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search rentals..."
            aria-label="Search rentals"
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-9 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-gold)] focus:bg-white/15 transition-all duration-300"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setOpen(false);
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {dropdown}
    </div>
  );
}

export default SearchBar;
