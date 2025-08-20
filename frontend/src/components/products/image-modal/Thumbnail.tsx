import { type image } from '@/lib/schemas/schemas'
import Image from 'next/image'
import React from 'react'

const Tumbnail = ({ images, setImgIndex }: { images: image[], setImgIndex: (index: number) => void }) => {
  return (
    <div className='md:flex hidden flex-1 gap-3 m-2 mt-4'>
      {images.map((image, index) => (
        // The button now acts as a sized placeholder
        <button
          key={image.id}
          className="flex-1 aspect-square relative" // Added aspect-square and relative
          onClick={() => setImgIndex(index)}
        >
          <Image
            className="rounded-2xl object-cover" // Added object-cover
            src={image.src}
            alt="image thumbnail"
            fill // Use fill to make the image cover the parent button
          />
        </button>
      ))}
    </div>
  )
}

export default Tumbnail
