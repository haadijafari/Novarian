import { type image } from '@/lib/schemas/schemas'
import Image from 'next/image'
import React from 'react'

const DesktopExtras = ({ images, setImgIndex }: { images: image[], setImgIndex: (imgIndex: number) => void }) => {
  return (
    <div className='flex flex-1 gap-3 m-2 mt-4'>
      {images.map((image, index) => (
        <button key={image.id} className="flex-1" onClick={() => { setImgIndex(index) }}>
          <Image className="rounded-2xl" src={image.src} alt="image" width={1000} height={1000} />
        </button>
      ))}
    </div>
  )
}

export default DesktopExtras
