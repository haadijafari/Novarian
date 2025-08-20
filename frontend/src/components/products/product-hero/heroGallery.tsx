'use client'

import React from 'react'
import { ImageCarousel, Slide } from '../ImageCarousel'
import DesktopExtras from './desktopExtras'
import MobileExtras from './mobileExtras'
import { useSyncedImageIndex } from '@/lib/useSyncedImageIndex'
import { type image } from '@/lib/schemas/schemas'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ROUTES } from '@/lib/routes'
import LinkWithTransition from '@/components/ui/LinkWithTransition'
import { imageModalTransition } from '@/transitions/imageModal'

// Props for the basic gallery with NO links
type Props = {
  slug: string
  images: Array<image>
  className?: string
  id?: string
}

export const HeroGallery = ({ id, images, className, slug }: Props) => {
  const [imgIndex, setImgIndex] = useSyncedImageIndex(images.length)

  return (
    <div
      dir="ltr"
      id={id}
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

          const PropductImage = <Image
            className="rounded-3xl w-full h-auto object-cover aspect-square"
            src={imageobject.src}
            alt={imageobject.id || 'product image'}
            width={1000}
            height={1000}
            priority={idx === imgIndex}
          />

          return (
            <Slide currentSlide={idx == imgIndex} key={idx}>
              <LinkWithTransition
                route={ROUTES.PRODUCT_IMAGE_MODAL}
                routeArgs={{ slug: slug, imageIndex: `${imgIndex}` }}
                transition={imageModalTransition}
              >
                {PropductImage}
              </LinkWithTransition>
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
    </div >
  )
}

export default HeroGallery
