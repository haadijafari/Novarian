import Image from 'next/image'
import React from 'react'

const ProductCard = () => {
  const bgColor = "white" // Using a more descriptive variable name
  const r = 10

  //WARNING: this page has a anti alignment problem conside using a clip-path solution and dynamicly change the r, w and h

  return (
    <>
      <div className={`bg-center bg-cover rounded-[${r}px] rounded-bl-[0] relative overflow-hidden`}>
        <Image
          width={1000} height={1000} src={"/3.jpg"} alt='tets' />

        <div
          style={{ borderRadius: `0 ${r}px 0 0` }}
          className={`flex items-center justify-center w-[100px] h-[20%] bg-${bgColor} absolute bottom-0 left-0`}
        >

          <svg className={`absolute left-0 bottom-full fill-${bgColor} translate-y-[0px]`} width={r} height={r}>
            <path d={`M0,0 L0,${r} L${r},${r} A${r},${r} 0 0,1 0,0 Z`} />
          </svg>

          <svg className={`absolute left-full bottom-0 fill-${bgColor} -translate-x-[0px]`} width={r} height={r}>
            <path d={`M0,0 L0,${r} L${r},${r} A${r},${r} 0 0,1 0,0 Z`} />
          </svg>

        </div>
      </div>
    </>
  )
}

export default ProductCard
