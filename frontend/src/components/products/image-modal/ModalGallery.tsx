'use client'

import { ImageCarousel, Slide } from '../ImageCarousel'
import Tumbnail from './Thumbnail'
import { useSyncedImageIndex } from '@/lib/useSyncedImageIndex'
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
              <div>
                {PropductImage}
              </div>
            </Slide>
          )
        })}
      </ImageCarousel>

      <Tumbnail
        images={images}
        setImgIndex={setImgIndex}
      />
    </div >
  )
}

export default ModalGallery
