import ImageGallery from '@/components/products/ImageGallery'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col'>

      <div className='flex items-center h-screen w-screen bg-fuchsia-600 lg:grow justify-center'>
        <div className='flex lg:shrink-0 p-2 lg:h-auto lg:basis-5xl bg-orange-400'>

          <div className="flex flex-3 bg-green-400 flex-col lg:pl-15 md:pl-4">
            <div className='bg-indigo-400 flex-1'>
              ksjdl
            </div>

            <div className='bg-violet-600 flex-1'>
              sdwee
            </div>
          </div>

          <ImageGallery />
        </div>
      </div>
      <div>should be under the above div</div>
    </div>
  )
}

export default page
