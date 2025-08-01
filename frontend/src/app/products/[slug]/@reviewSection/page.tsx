import ReviewCard from '@/components/products/review-card/reviewCard'
import { mockReviews } from './mockReviews'

import React from 'react'

const ReviewSection = async () => {
  // TODO: fetch the product here
  // Simulate delay only once when slug changes (page load)
  await new Promise((res) => setTimeout(res, 0))
  const reviews = mockReviews
  const review = reviews[1]

  return (
    <>
      <ReviewCard review={review} />
    </>
  )
}

export default ReviewSection
