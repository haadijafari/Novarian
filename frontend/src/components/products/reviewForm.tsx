'use client'

import { type rating } from '@/lib/schemas/schemas'
import React, { useState } from 'react'
import Rating from './rating-stars'

const ReviewForm = () => {
  const [rating, setRating] = useState<rating>(0)
  return (
    <form>
      <Rating value={rating} setValue={setRating} />
    </form>
  )
}

export default ReviewForm
