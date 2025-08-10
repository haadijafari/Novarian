import React from 'react'
import ImageGallery from '@/components/products/image-gallery'
import { type image } from '@/lib/schemas/schemas'

export default async function ProductHero({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // TODO: fetch the product here
  // Simulate delay only once when slug changes (page load)
  await new Promise((res) => setTimeout(res, 100))

  const images: Array<image> = [
    { id: '1', src: '/1.jpg' },
    { id: '2', src: '/2.jpg' },
    { id: '3', src: '/3.jpg' },
    { id: '4', src: '/4.jpg' },
  ]

  console.log('server rendered')

  return (
    <div className='flex w-full max-w-7xl p-2 md:flex-row flex-col bg-orange-400 rounded-lg'>
      {/* Pass slug and images only */}
      <ImageGallery slug={slug} images={images} />
      <div className="flex flex-[3] bg-green-500 flex-col md:pr-4">
        <div className='bg-indigo-400 flex-1'>
          <h2>کادوی مردانه</h2>
          <h1>کتانی نسخه محدود پاییز</h1>
          این کتانی‌های کم‌ارتفاع همراهی عالی برای استایل روزمره شما هستند. با داشتن زیره‌ای مقاوم از جنس لاستیک، در برابر هر نوع شرایط آب‌وهوایی دوام می‌آورند و طراحی ساده و شیک آن‌ها به‌راحتی با هر نوع لباسی ست می‌شود.
        </div>
        <div className='fixed md:static bottom-0 bg-violet-600 flex-1'>
          <h3 className='flex-1'>13000</h3>
          <button className='flex-1 h-16 bg-surface-accent'>سفارش</button>
        </div>
      </div>
    </div>
  )
}
