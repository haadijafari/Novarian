'use client'

import { JSX, type Dispatch, type SetStateAction } from 'react'
import React from 'react'
import { motion, useMotionValue } from 'motion/react'
import { type image } from '@/lib/schemas/schemas'

type ImageCarouselProps = {
  images: image[]
  imgIndex: number
  setImgIndex: Dispatch<SetStateAction<number>>
  children: JSX.Element[]
}

const DRAG_BUFFER = 50

const SPRING_OPTIONS = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50,
}

export const ImageCarousel = ({
  images,
  imgIndex,
  setImgIndex,
  children,
}: ImageCarouselProps) => {
  const dragX = useMotionValue(0)

  const onDragEnd = () => {
    const x = dragX.get()
    if (x > DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((prev) => prev - 1)
    } else if (x < -DRAG_BUFFER && imgIndex < images.length - 1) {
      setImgIndex((prev) => prev + 1)
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x: dragX }}
      onDragEnd={onDragEnd}
      animate={{ translateX: `-${imgIndex * 100}%` }}
      initial={false}
      transition={SPRING_OPTIONS}
      className="flex h-full cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  )
}

type slideProps = { currentSlide: boolean, children: JSX.Element }

export const Slide = ({ currentSlide, children }: slideProps) => {
  return (
    <motion.div
      animate={{ scale: currentSlide ? 1 : 0.85 }}
      transition={SPRING_OPTIONS}
      className="w-full flex-shrink-0"
    >
      {children}
    </motion.div>
  )
}

export default ImageCarousel
