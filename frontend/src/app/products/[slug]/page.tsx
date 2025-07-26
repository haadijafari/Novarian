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
  const { slug } = await params

  return (
    <div className='flex flex-col'>
      <div>should be under the above div</div>
    </div>
  )
}
