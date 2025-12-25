import ReviewList from "@/components/ReviewList"
import Link from "next/link"

export default function ReviewsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <Link
          href="/reviews/new"
          className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors"
        >
          Add New Review
        </Link>
      </div>
      <ReviewList />
    </div>
  )
}
