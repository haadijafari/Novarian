import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  const NUM_IMG = 4

  return <Skeleton className='flex w-full max-w-7xl p-2 md:flex-row flex-col bg-orange-400 rounded-lg'>
    <Skeleton className="flex flex-[4] aspect-square bg-cyan-100 flex-col p-2">
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

    </Skeleton>

    <Skeleton className="flex flex-[3] bg-green-500 flex-col md:pr-4">
      <Skeleton className='bg-indigo-400 flex-1' />
      <Skeleton className='bg-violet-600 flex-1' />
    </Skeleton>

  </Skeleton>
}
