import { type Product } from '@/lib/schemas/schemas'
import Image from 'next/image'
import React, { type JSX } from 'react'

type Props = { product: Product, button: JSX.Element, className?: string } & React.HTMLAttributes<HTMLDivElement>

const ProductCard = ({ product, button, className, ...rest }: Props) => {
  const { image_url, id } = product.primary_image
  const r = 10

  //WARNING: this page has a anti alignment problem conside using a clip-path solution and dynamicly change the r, w and h
  return (
    <>
      <div
        className={`bg-center bg-cover rounded-[${r}px] rounded-br-[0] relative overflow-hidden ${className}`}
        {...rest}
      >
        <Image
          width={1000} height={1000} src={image_url} alt={`image ${id}`} />

        <div
          style={{ borderRadius: `${r}px 0 0 0` }}
          className={`flex items-center justify-center w-[100px] h-[20%] bg-surface absolute bottom-0 right-0`}
        >
          {button}

          <svg className={`absolute right-0 bottom-full fill-surface translate-y-[0px] rotate-y-180`} width={r} height={r}>
            <path d={`M0,0 L0,${r} L${r},${r} A${r},${r} 0 0,1 0,0 Z`} />
          </svg>

          <svg className={`absolute right-full bottom-0 fill-surface -translate-x-[0px] rotate-y-180`} width={r} height={r}>
            <path d={`M0,0 L0,${r} L${r},${r} A${r},${r} 0 0,1 0,0 Z`} />
          </svg>

        </div>
      </div>
    </>
  )
}

export default ProductCard
