import ProductFilter from '@/components/products/ProductFilter'
import React from 'react'

const Products = () => {

  //TODO: get the list of products from backend
  // TODO: get the categories from backend

  /* const categories: Category[] = [
    { name: "all", Icon: "message-circle-question" },
    { name: "man", Icon: "mars" },
    { name: "women", Icon: "venus" },
    { name: "cs", Icon: "laptop-minimal" },
    { name: "brush", Icon: "brush" }
  ]; */


  return (
    <>
      <ProductFilter />
      <div>
        <h1>156 products</h1>
        <button>filter</button>
      </div>
      <ol className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 md:grid-cols-3 gap-4 m-[10%]'>
      </ol>
    </>
  )
}

export default Products
