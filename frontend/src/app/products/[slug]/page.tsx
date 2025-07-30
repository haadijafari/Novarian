import React from 'react'

// This tells Next.js which slugs to pre-build.
export async function generateStaticParams() {
  //TODO: fetch this from database
  // For now, i use slug test to do the testing.
  const products = [{ slug: 'test' }];

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  //TODO slug isnt uesd here, ether use it or remove it, just remember to remove it from its parents too
  const { slug } = await params
  console.log(slug)
  return (
    <div className='flex flex-col'>
      <div>should be under the above div</div>
    </div>
  )
}
