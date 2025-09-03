import { ReviewList } from '@/components/products/product-detail/customer-reviews'

async function getReviews() {
  //TODO: fetch from server
  const { mockReviews } = await import('./mockReviews') // Assuming mock data is in the same directory
  return mockReviews
}

const ReviewSection = async () => {
  const allReviews = await getReviews()

  return (
    <div className="p-8 w-full bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        نظر کاربران
      </h1>

      {/* 4. Pass all fetched reviews to the Client Component */}
      <ReviewList initialReviews={allReviews} />
    </div>
  )
}

export default ReviewSection
