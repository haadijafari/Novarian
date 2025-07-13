import Image from 'next/image'
import React from 'react'

const ImageGallery = () => {
  return (
    <>
      {/* image div */}
      < div className="flex flex-4 bg-cyan-100 flex-col" >
        <div className=''>
          <Image src="/1.jpg" alt="image" width={1000} height={1000} />
        </div>

        {/* light box div */}
        <div className='bg-red-700 flex flex-1'>
          <div className="flex-1 bg-pink-300">
            <Image src="/1.jpg" alt="image" width={1000} height={1000} />
          </div>
          <div className="flex-1 bg-pink-400">
            <Image src="/1.jpg" alt="image" width={1000} height={1000} />
          </div>
          <div className="flex-1 bg-pink-500">
            <Image src="/1.jpg" alt="image" width={1000} height={1000} />
          </div>
          <div className="flex-1 bg-pink-600">
            <Image src="/1.jpg" alt="image" width={1000} height={1000} />
          </div>
        </div>
      </div >
    </>

  )
}

export default ImageGallery
