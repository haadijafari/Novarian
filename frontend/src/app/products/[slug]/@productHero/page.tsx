import React, { Suspense } from 'react'
import ImageGallery from '@/components/products/image-gallery'
import { type image } from '@/lib/schemas/schemas'
import ImageGallerySkeleton from '@/components/products/image-gallery/ImageGallerySkeleton'
import { type ReadonlyURLSearchParams } from 'next/navigation'

async function getProductData(_: string) {

  // TODO: fetch the product here using the slug
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 1000))

  const images: Array<image> = [
    { id: '1', src: '/1.jpg' },
    { id: '2', src: '/2.jpg' },
    { id: '3', src: '/3.jpg' },
    { id: '4', src: '/4.jpg' },
  ]
  return { images }
}

export default async function ProductHeroPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: ReadonlyURLSearchParams
}) {
  const { slug } = await params
  const { images } = await getProductData(slug)

  // Create a unique key from the URL search params to prevent state "flicker"
  const galleryKey = new URLSearchParams(searchParams).toString()

  return (
    <div className="flex w-full max-w-7xl p-2 md:flex-row flex-col bg-orange-400 rounded-lg">

      {/* Dynamic Part: The Image Gallery is wrapped in Suspense */}
      <Suspense key={galleryKey} fallback={<ImageGallerySkeleton className="flex-[4]" />}>
        <ImageGallery className="flex-[4]" slug={slug} images={images} />
      </Suspense>

      {/* Static Part: The product details */}
      <div className="flex flex-[3] bg-green-500 flex-col md:pr-4">
        <div className="bg-indigo-400 flex-1">
          <h2>کادوی مردانه</h2>
          <h1>کتانی نسخه محدود پاییز</h1>
          این کتانی‌های کم‌ارتفاع همراهی عالی برای استایل روزمره شما هستند. با
          داشتن زیره‌ای مقاوم از جنس لاستیک، در برابر هر نوع شرایط آب‌وهوایی
          دوام می‌آورند و طراحی ساده و شیک آن‌ها به‌راحتی با هر نوع لباسی ست
          می‌شود.
        </div>
        <div className="fixed md:static bottom-0 bg-violet-600 flex-1">
          <h3 className="flex-1">13000</h3>
          <button className="flex-1 h-16 bg-surface-accent">سفارش</button>
        </div>
      </div>
    </div>
  )
}
