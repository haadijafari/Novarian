import React from 'react'
import Image from 'next/image'

const ProductCards = () => {
  return (
    <li>
      <Image
        src="/1.jpg"
        width={500}
        height={500}
        alt='picture'
      />
    </li>
  )
}

export default ProductCards
