import ImageGallery from '@/components/products/ImageGallery'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex items-center h-screen w-screen bg-fuchsia-600  p-4 flex-col'>
        <div>test</div>

        <div className='flex w-full max-w-7xl p-2 md:flex-row flex-col-reverse bg-orange-400 rounded-lg'>
          <div className="flex flex-[3] bg-green-400 flex-col md:pl-4">
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
