import { type image } from '@/lib/schemas/schemas'
import Image from 'next/image'
import React from 'react'

const Tumbnail = ({ images, setImgIndex }: { images: image[], setImgIndex: (index: number) => void }) => {
  return (
    <div className='flex portrait:flex-row landscape:flex-col gap-3 h-full'>
      {images.map((image, index) => (
        <button
          key={image.id}
          className="w-full aspect-square relative"
          onClick={() => setImgIndex(index)}
        >
          <Image
            className="rounded-2xl object-cover"
            src={image.src}
            alt="image thumbnail"
            fill
          />
        </button>
      ))}
    </div>
  )
}

export default Tumbnail
