'use client'

import Image from 'next/image'
import { useState, CSSProperties } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  style?: CSSProperties
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.jpg',
  style
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (!hasError) {
          setHasError(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
