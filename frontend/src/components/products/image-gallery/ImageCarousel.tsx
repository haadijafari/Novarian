'use client'

import { type Dispatch, type SetStateAction } from 'react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue } from 'motion/react'
import { type image } from '@/lib/schemas/schemas'

type Props = {
  images: image[]
  imgIndex: number
  setImgIndex: Dispatch<SetStateAction<number>>
  // A function to generate the href for a given image
  getHref?: (image: image) => string
  // A function to handle the left-click on the link
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  priorityImageIndex?: number
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
  getHref,
  onLinkClick,
  priorityImageIndex = 0
}: Props) => {
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
      {images.map((imageObject, idx) => {
        const href = getHref?.(imageObject)

        return (
          <motion.div
            key={imageObject.id}
            animate={{ scale: idx === imgIndex ? 1 : 0.85 }}
            transition={SPRING_OPTIONS}
            className="w-full flex-shrink-0"
          >
            <ImageWrapper
              href={href}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => href && onLinkClick?.(e, href)}
            >
              <Image
                className="rounded-3xl w-full h-auto object-cover aspect-square"
                src={imageObject.src}
                alt={imageObject.id || 'Product image'}
                width={1000}
                height={1000}
                onDragStart={(e) => e.preventDefault()}
                priority={idx === priorityImageIndex}
              />
            </ImageWrapper>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Helper component to avoid repetitive conditional logic in the map loop
const ImageWrapper = ({
  href,
  children,
  ...props
}: {
  href?: string
  children: React.ReactNode
  [key: string]: any
}) => {
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }
  return <div {...props}>{children}</div>
}

export default ImageCarousel
