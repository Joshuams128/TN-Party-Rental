'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Eraser } from 'lucide-react'

const W = 900
const H = 260

// Finger/mouse/stylus signature canvas. The drawing surface has a fixed internal size and scales with CSS,
// so rotating a phone or resizing the window never wipes the signature.
export default function SignaturePad({
  onChange,
  disabled,
  label = 'Sign here',
}: {
  onChange: (png: string | null) => void
  disabled?: boolean
  label?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [empty, setEmpty] = useState(true)

  const point = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return
    e.preventDefault()
    canvas.current!.setPointerCapture(e.pointerId)
    drawing.current = true
    const p = point(e)
    last.current = p
    const ctx = canvas.current!.getContext('2d')!
    ctx.fillStyle = '#111'
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2)
    ctx.fill()
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return
    e.preventDefault()
    const ctx = canvas.current!.getContext('2d')!
    const p = point(e)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 3.4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    setEmpty(false)
    onChange(canvas.current!.toDataURL('image/png'))
  }

  const clear = useCallback(() => {
    canvas.current!.getContext('2d')!.clearRect(0, 0, W, H)
    setEmpty(true)
    onChange(null)
  }, [onChange])

  useEffect(() => {
    if (disabled) clear()
  }, [disabled, clear])

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          aria-label="Signature drawing area"
          className="block w-full cursor-crosshair"
          style={{ touchAction: 'none', aspectRatio: `${W} / ${H}` }}
        />
        {empty && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            {label}
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-6 bottom-9 border-b border-gray-300" />
      </div>
      <button
        type="button"
        onClick={clear}
        disabled={empty}
        className="mt-2 flex min-h-[44px] items-center gap-1 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-40"
      >
        <Eraser size={14} /> Clear
      </button>
    </div>
  )
}

// A typed name drawn as a signature image, so drawn and typed signatures are stored and printed the same way.
export function typedSignatureImage(name: string): string {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  let size = 120
  const family = '"Brush Script MT", "Snell Roundhand", "Segoe Script", "Apple Chancery", cursive'
  do {
    ctx.font = `italic ${size}px ${family}`
    size -= 6
  } while (ctx.measureText(name).width > W - 60 && size > 30)
  ctx.fillStyle = '#111'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, 30, H / 2)
  return c.toDataURL('image/png')
}
