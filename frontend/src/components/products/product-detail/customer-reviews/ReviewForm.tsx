'use client'

import RatingStars from '@/components/ui/RatingStars'
import { type rating } from '@/lib/schemas/schemas'
import React, { useState } from 'react'

const ReviewForm = () => {
  const [rating, setRating] = useState<rating>(0)
  return (
    <form>
      <RatingStars value={rating} setValue={setRating} />
    </form>
  )
}

export default ReviewForm
