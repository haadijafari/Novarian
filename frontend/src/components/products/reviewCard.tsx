import { review } from '@/lib/schemas/schemas'
import Image from 'next/image'
import React from 'react'
import Rating from './rating-stars'

const ReviewCard = ({ review }: { review: review }) => {

  return (
    <div className='rounded-2xl flex flex-col w-[360px] bg-red-50'>
      {review.pictureURL && <div className="flex-1 aspect-square relative bg-slate-300">
        <Image alt={`image of product`} src={review.pictureURL} fill={true} />
      </div>
      }
      <div className="flex-1 bg-slate-400">icon</div>
      <div className="flex-1/2 flex bg-slate-500">
        <div className='flex-1 bg-slate-600'>
          <h3>name</h3>
          <h6>state</h6>
        </div>
        <div className='flex-1 bg-slate-300'><Rating value={review.rating} /></div>
      </div>
      <div className="flex-1/2 grow bg-slate-700">{review.discription}</div>
    </div>
  )
}

export default ReviewCard
