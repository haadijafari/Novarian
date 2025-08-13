'use client'

import React, { useState, useEffect } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
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
  const router = useTransitionRouter()


  // Conditionally create props for the child carousel
  const carouselLinkProps = isImageGalleryWithLinks(props)
    ? {
      getHref: (image: image) => `/products/${props.slug}/image/${image.id}`,
      onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        router.push(href)
      },
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
const pageAnimation = () => {
  /* document.documentElement.animate(
    [
      {
        opacity: 1,
        scale: 1,
        transform: "translateY(0)",
      },
      {
        opacity: 0.5,
        scale: 0.9,
        transform: "translateY(-100px)",
      },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [
      {
        transform: "translateY(100%)",
      },
      {
        transform: "translateY(0)",
      },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  ); */
};

export default ProductImageGallery
