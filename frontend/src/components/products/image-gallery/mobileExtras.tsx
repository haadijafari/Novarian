import { type Dispatch, type SetStateAction, } from 'react'
import React from 'react'

type Props = {
  imgIndex: number
  setImgIndex: Dispatch<SetStateAction<number>>
  numImages: number
}

const MobileExtras = ({ imgIndex, setImgIndex, numImages }: Props) => {

  return (
    <div className='md:hidden flex absolute justify-center w-full gap-1 bottom-2'>
      {[...Array(numImages)].map((_, idx) => {
        return <button
          className={`h-3 w-3 rounded-full bg-black ${imgIndex == idx && "bg-white w-8"} duration-300 ease-in-out transition-all`}
          onClick={() => { setImgIndex(idx) }}
          key={idx} />
      })}
    </div>
  )
}

export default MobileExtras
