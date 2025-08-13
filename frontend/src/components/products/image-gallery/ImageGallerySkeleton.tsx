import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import React from 'react'

const ImageGallerySkeleton = ({ className }: { className: string }) => {
  const NUM_IMG = 4

  return (
    <Skeleton className={cn("flex aspect-square bg-cyan-100 flex-col p-2", className)} >
      <Skeleton className="flex flex-[4] aspect-square bg-cyan-100 flex-col p-2" />
      {/* desktop */}
      <div className='md:block hidden'>
        <div className='flex flex-1 gap-3 m-2 mt-4'>
          {[...Array(NUM_IMG)].map((_, idx) => (
            <div key={idx} className="bg-red-200 flex-1 aspect-square">
              <div >
                <div className="rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Skeleton >
  )
}

export default ImageGallerySkeleton 
