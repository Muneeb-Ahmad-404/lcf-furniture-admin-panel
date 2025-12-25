"use client"

import { useState, useEffect } from "react"

interface Review {
  _id: string
  name: string
  stars: number
  comment: string
  featured: boolean
  active: boolean
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)


   const [token, setToken] = useState<string | null>(null);
   const [loadingToken, setLoadingToken] = useState(true);
 
   useEffect(() => {
     const storedToken = localStorage.getItem("admin_token");
     setToken(storedToken);
     setLoadingToken(false);
   }, []);

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_URL}/api/reviews`)
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

   if (loadingToken) {
     return <div>Checking authentication...</div>; // or spinner
   }
 
   if (!token) {
     return <div>You must be logged in as admin</div>; // no alert, just render message
   }

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/reviews/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
 })
      fetchReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <tr key={review._id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{review.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{"⭐".repeat(review.stars)}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{review.comment}</td>
              <td className="px-6 py-4 text-sm">
                {review.featured && (
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-[#F69F1B] text-white">Featured</span>
                )}
              </td>
              <td className="px-6 py-4 text-right text-sm">
                <button onClick={() => deleteReview(review._id)} className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
