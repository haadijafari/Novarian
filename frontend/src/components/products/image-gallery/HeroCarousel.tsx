'use client'

import { type Dispatch, type SetStateAction, } from 'react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue } from 'motion/react'
import { type image } from '@/lib/schemas/schemas'


type Props = {
  images: image[]
  imgIndex: number
  setImgIndex: Dispatch<SetStateAction<number>>
  slug: string
}

const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export const HeroCarousel = ({ images, imgIndex, setImgIndex, slug }: Props) => {
  console.log("hi rg")
  const onDragEnd = () => {
    const X = dragX.get()
    if (X > DRAG_BUFFER && imgIndex !== 0) {
      setImgIndex(prev => prev - 1)
    }
    if (X < -DRAG_BUFFER && imgIndex < images.length - 1) {
      setImgIndex(prev => prev + 1)
    }
  }
  const dragX = useMotionValue(0)

  return (
    <motion.div
      drag='x'
      initial={false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      style={{ x: dragX }}
      onDragEnd={onDragEnd}
      animate={{ translateX: `-${imgIndex * 100}%` }}
      transition={SPRING_OPTIONS}
      className='flex'
    >
      {images.map((imageObject, idx) => {
        return (
          <motion.div
            animate={{ scale: idx == imgIndex ? 1 : .85 }}
            className='w-full flex-shrink-0 snap-center'
            transition={SPRING_OPTIONS}
            key={imageObject.id}
          >
            <Link
              href={`/products/${slug}/image/${imageObject.id}`}>
              <Image
                className='rounded-3xl w-full h-auto object-cover aspect-square'
                src={imageObject.src}
                alt={imageObject.id || 'Product image'}
                width={1000}
                height={1000}
              />
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default HeroCarousel
