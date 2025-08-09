'use client'

import React, { useState, useMemo } from 'react'
import MasonryLayout from '@/components/ui/masonryLayout'
import ReviewCard from '@/components/products/review-card/reviewCard'
import { review } from '@/lib/schemas/schemas'

const ReviewList = ({ initialReviews }: { initialReviews: review[] }) => {
  const [itemCount, setItemCount] = useState(3)

  const handleLoadMore = () => {
    setItemCount((prevCount) => prevCount + 3)
  }

  const displayedReviews = useMemo(
    () => initialReviews.slice(0, itemCount),
    [itemCount, initialReviews]
  )

  const hasMoreItems = itemCount < initialReviews.length

  return (
    <>
      <MasonryLayout
        gap={16}
        className="container mx-auto overflow-hidden"
        columnCount={3}
        showLongestColumn={!hasMoreItems}
      >
        {displayedReviews.map((review) => (
          <ReviewCard key={review.user} review={review} />
        ))}
      </MasonryLayout>

      {hasMoreItems && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Load More
          </button>
        </div>
      )}
    </>
  )
}

export default ReviewList
