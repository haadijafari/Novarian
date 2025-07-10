import ProductCards from '@/components/products/ProductCards'
import ProductFilter from '@/components/products/ProductFilter'
import React from 'react'

type Props = {}

const Products = (props: Props) => {
  return (
    <>
      <ProductFilter />
      <div>
        <h1>156 products</h1>
        <button>filter</button>
      </div>
      <ol>
        <ProductCards />
      </ol>
    </>
  )
}

export default Products
