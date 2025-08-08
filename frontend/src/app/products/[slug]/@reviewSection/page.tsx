'use client';

import React, { useState, useMemo } from 'react';
import MasonryLayout from '@/components/ui/masonryLayout';
import ReviewCard from '@/components/products/review-card/reviewCard';

import { mockReviews } from './mockReviews';

const ReviewSection = () => {
  const [itemCount, setItemCount] = useState(3);

  const handleLoadMore = () => {
    setItemCount((prevCount) => prevCount + 3);
  };

  const displayedReviews = useMemo(
    () => mockReviews.slice(0, itemCount),
    [itemCount]
  );

  // Check if there are more reviews to load from the original array
  const hasMoreItems = itemCount < mockReviews.length;

  return (
    <div className="p-8 w-full bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        نظر کاربران
      </h1>

      <MasonryLayout
        gap={16}
        className="container mx-auto"
        columnCount={3}
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
    </div>
  );
};

export default ReviewSection;
