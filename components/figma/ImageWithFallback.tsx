'use client'

import Image from 'next/image'
import { useState, CSSProperties } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  style?: CSSProperties
  priority?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.jpg',
  style,
  priority = false
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Check if it's an external URL or local image
  const isExternal = imgSrc.startsWith('http')

  if (isExternal) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        className={className}
        style={style}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => {
          if (!hasError) {
            setHasError(true)
            setImgSrc(fallbackSrc)
          }
        }}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => {
        if (!hasError) {
          setHasError(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
