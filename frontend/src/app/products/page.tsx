import ProductCards from '@/components/products/ProductCard'
import ProductFilter from '@/components/products/ProductFilter'
import React from 'react'

type Props = {}

const Products = (props: Props) => {

  //TODO: get the list of products from backend
  const products = [...Array(10)]

  return (
    <>
      <ProductFilter />
      <div>
        <h1>156 products</h1>
        <button>filter</button>
      </div>
      <ol className='grid grid-cols-1 gap-8'>
        {products.map((product, i) => {
          return <ProductCards key={i} />
        })}
      </ol>
    </>
  )
}

export default Products
