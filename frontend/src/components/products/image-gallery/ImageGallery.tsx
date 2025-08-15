'use client'

import React from 'react'
import { ImageCarousel } from './ImageCarousel'
import DesktopExtras from './desktopExtras'
import MobileExtras from './mobileExtras'
import { useSyncedImageIndex } from '@/lib/useSyncedImageIndex'
import { type image } from '@/lib/schemas/schemas'
import { cn } from '@/lib/utils'

// Props for the basic gallery with NO links
type ImageGalleryBaseProps = {
  slug?: never
  images: Array<image>
  className?: string
}

// Props for the gallery WITH links
type ImageGalleryWithLinksProps = {
  slug: string
  images: Array<image>
  className?: string
}

type Props = ImageGalleryBaseProps | ImageGalleryWithLinksProps

// A type guard function to check which mode the component is in
function isImageGalleryWithLinks(props: Props): props is ImageGalleryWithLinksProps {
  return typeof props.slug === 'string'
}

export const ProductImageGallery = (props: Props) => {
  const { images, className } = props

  const [imgIndex, setImgIndex] = useSyncedImageIndex(images.length)


  // Conditionally create props for the child carousel
  const carouselLinkProps = isImageGalleryWithLinks(props)
    ? {
      getHref: (image: image) => `/products/${props.slug}/image/${image.id}`,
    }
    : {}

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
        {...carouselLinkProps}
      />

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
