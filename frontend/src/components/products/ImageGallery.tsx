import Image from 'next/image'
import Link from 'next/link' // <-- Import the Link component
import React from 'react'

type image = { id: string, src: string }

const ImageGallery = ({ slug, images }: { slug: string, images: Array<image> }) => {
  // we'll just use the first image as the main one
  const mainImage = images[0];

  return (
    <div className="flex flex-[4] bg-cyan-100 flex-col p-2">

      {/* The link will point to a unique URL for that specific image */}
      <Link href={`/products/${slug}/image/${mainImage.id}`}>
        <Image className='rounded-3xl w-full h-auto object-cover aspect-square' src={mainImage.src} alt="image" width={1000} height={1000} />
      </Link>

      {/* Thumbnails - these are not links yet */}
      <div className='flex flex-1 gap-3 m-2 mt-4'>
        {images.map((image) => (
          <div key={image.id} className="flex-1">
            <Image className="rounded-2xl" src={image.src} alt="image" width={1000} height={1000} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
