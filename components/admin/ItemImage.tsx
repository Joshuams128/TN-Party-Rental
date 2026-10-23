import { ImageIcon } from 'lucide-react'
import { itemImageUrl } from '@/lib/items'

export default function ItemImage({ path, className = 'h-12 w-12' }: { path: string | null; className?: string }) {
  const src = itemImageUrl(path)
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" className={`${className} shrink-0 rounded-lg bg-gray-800 object-cover`} />
  ) : (
    <div className={`${className} flex shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-400`}>
      <ImageIcon size={18} />
    </div>
  )
}
