'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ImageCarousel from './ImageCarousel'
import DesktopExtras from './desktopExtras'
import { type image } from '@/lib/schemas/schemas'
import { useMediaQuery } from '@/lib/useMediaQuery'
import MobileExtras from './mobileExtras'

const ImageGallery = ({ slug, images }: { slug: string, images: Array<image> }) => {
  // use useSearchParams to get the initial state on first load
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery("(width < 768px)")

  const getInitialIndex = () => {
    const param = searchParams.get('imgIndex')
    if (param) {
      const index = parseInt(param, 10)
      if (!isNaN(index) && index >= 0 && index < images.length) {
        return index
      }
    }
    return 0
  }

  const [imgIndex, setImgIndex] = useState(getInitialIndex)

  // This effect uses the browser's History API for shallow routing
  useEffect(() => {
    // Construct the new URL
    const newUrl = `${window.location.pathname}?imgIndex=${imgIndex}`
    // Use replaceState to update the URL without a page reload or server re-render
    window.history.replaceState(null, '', newUrl)
  }, [imgIndex])

  return (
    <div dir='ltr'
      className='flex flex-[4] bg-cyan-100 flex-col p-2 relative h-full w-full overflow-x-hidden rounded-3xl'>
      <ImageCarousel images={images} setImgIndex={setImgIndex} imgIndex={imgIndex} slug={slug} />
      {isMobile ?
        <MobileExtras numImages={images.length} setImgIndex={setImgIndex} imgIndex={imgIndex} />
        :
        <DesktopExtras images={images} setImgIndex={setImgIndex} />
      }
    </div>
  )
}

export default ImageGallery
