'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.jpg'
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
