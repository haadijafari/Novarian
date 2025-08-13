import ImageGallerySkelleton from "@/components/products/image-gallery/ImageGallerySkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Skeleton className='flex w-full max-w-7xl p-2 md:flex-row flex-col bg-orange-400 rounded-lg'>
      <ImageGallerySkelleton className="flex-[4]" />
      <Skeleton className="flex flex-[3] bg-green-500 flex-col md:pr-4">
        <Skeleton className='bg-indigo-400 flex-1' />
        <Skeleton className='bg-violet-600 flex-1' />
      </Skeleton>
    </Skeleton>
  )
}
