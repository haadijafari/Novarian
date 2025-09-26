'use client'

import { ImageCarousel, Slide } from '../ImageCarousel'
import Tumbnail from './_parts/Thumbnail'
import { useSyncedImageIndex } from '@/lib/hooks'
import { type image } from '@/lib/schemas/schemas'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = {
  images: Array<image>
  className?: string
  id?: string
}

export const ModalGallery = ({ images, id, className }: Props) => {
  const [imgIndex, setImgIndex] = useSyncedImageIndex(images.length)

  return (
    <div
      dir="ltr"
      id={id}
      className={cn(
        'flex portrait:flex-col landscape:flex-row gap-4 p-2 relative h-full w-full rounded-3xl',
        className
      )}
    >
      <div className="portrait:w-full portrait:h-4/5 landscape:h-full landscape:w-4/5">
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
                <div>
                  {PropductImage}
                </div>
              </Slide>
            )
          })}
        </ImageCarousel>
      </div>
      <div className="landscape:w-[calc((100%-(0.75rem*4))/5)] portrait:h-[calc((100%-(0.75rem*4))/5)]">
        {/* Calculates the side length for 5 square items to fit vertically, accounting for a total gap space of 3rem. */}
        <Tumbnail
          images={images}
          setImgIndex={setImgIndex}
        />
      </div>
    </div >
  )
}

export default ModalGallery
