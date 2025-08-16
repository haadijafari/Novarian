'use client'

import React from 'react'
import { ImageCarousel, Slide } from './ImageCarousel'
import DesktopExtras from './desktopExtras'
import MobileExtras from './mobileExtras'
import { useSyncedImageIndex } from '@/lib/useSyncedImageIndex'
import { type image } from '@/lib/schemas/schemas'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

// Props for the basic gallery with NO links
type Props = {
  slug?: never
  images: Array<image>
  className?: string
}

export const ProductImageGallery = ({ images, className }: Props) => {
  const [imgIndex, setImgIndex] = useSyncedImageIndex(images.length)

  return (
    <div
      dir="ltr"
      className={cn(
        'flex flex-col p-2 relative h-full w-full overflow-x-hidden rounded-3xl',
        className
      )}
    >
      <ImageCarousel
        images={images}
        setImgIndex={setImgIndex}
        imgIndex={imgIndex}
      >
        {images.map((imageobject, idx) => {
          return (
            <Slide currentSlide={idx == imgIndex} key={idx}>
              <Link href='#'>
                <Image
                  className="rounded-3xl w-full h-auto object-cover aspect-square"
                  src={imageobject.src}
                  alt={imageobject.id || 'product image'}
                  width={1000}
                  height={1000}
                  priority={idx === imgIndex}
                />
              </Link>
            </Slide>
          )
        })}
      </ImageCarousel>

      <MobileExtras
        numImages={images.length}
        setImgIndex={setImgIndex}
        imgIndex={imgIndex}
      />
      <DesktopExtras
        images={images}
        setImgIndex={setImgIndex}
      />
    </div>
  )
}

export default ProductImageGallery
