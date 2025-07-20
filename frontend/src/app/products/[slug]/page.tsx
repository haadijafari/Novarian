import ImageGallery from '@/components/products/ImageGallery'
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
  //TODO: fetch this from database
  const images = [
    { id: '1', src: '/1.jpg' },
    { id: '2', src: '/2.jpg' },
    { id: '3', src: '/3.jpg' },
    { id: '4', src: '/4.jpg' },
  ]

  const { slug } = await params

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
        <div className='flex w-full max-w-7xl p-2 md:flex-row flex-col-reverse bg-orange-400 rounded-lg'>
          <div className="flex flex-[3] bg-green-400 flex-col md:pl-4">

            <div className='bg-indigo-400 flex-1'>
              Product Info
            </div>

            <div className='bg-violet-600 flex-1'>
              Price & Actions
            </div>
          </div>

          <ImageGallery slug={slug} images={images} />

        </div>
      </div>
      <div>should be under the above div</div>
    </div>
  )
}
