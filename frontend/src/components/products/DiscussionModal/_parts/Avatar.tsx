import Image from 'next/image'
import React from 'react'

const Avatar = () => {
  return (
    <>
      <p
        className="justify-center flex items-center relative h-4/5 w-auto aspect-square bg-surface-accent rounded-full start-2"
      >
        <Image src='/userImg.webp' alt='test' fill />
      </p>
      <div className='font-bold px-4'>
        <p>
          علی
        </p>
        <p className='text-[.6em]'>
          خریداری شده
        </p>
      </div>
    </>
  )
}

export default Avatar
