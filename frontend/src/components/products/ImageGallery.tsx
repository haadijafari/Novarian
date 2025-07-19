import Image from 'next/image'
import React from 'react'

const ImageGallery = () => {
  const ImageArray = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"]
  return (
    <>
      <div className="flex flex-4 bg-cyan-100 flex-col" >
        {/*mobile*/}
        <div className='sm:hidden flex'>
          <Image className='rounded-3xl' src="/1.jpg" alt="image" width={1000} height={1000} />
        </div>

        {/*desktop*/}
        <div className='sm:block hidden'>
          <div>
            <Image className='rounded-3xl' src="/1.jpg" alt="image" width={1000} height={1000} />
          </div>

          {/* light box div */}
          <div className='flex flex-1 gap-3 m-2 mt-4'>
            {ImageArray.map((e, i) => {
              return <div key={i} className="flex-1">
                <Image className="rounded-2xl" src={e} alt="image" width={1000} height={1000} />
              </div>
            })}
          </div>
        </div >)
      </div>
    </>

  )
}

export default ImageGallery
