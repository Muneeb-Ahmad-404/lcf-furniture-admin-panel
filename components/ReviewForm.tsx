"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"


export default function ReviewForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    stars: 5,
    comment: "",
    featured: false,
  })


    const [token, setToken] = useState<string | null>(null);
    const [loadingToken, setLoadingToken] = useState(true);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("admin_token");
      setToken(storedToken);
      setLoadingToken(false);
    }, []);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      })

      router.push("/reviews")
    } catch (error) {
      console.error("Error saving review:", error)
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <select
            value={formData.stars}
            onChange={(e) => setFormData({ ...formData, stars: Number.parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {"⭐".repeat(num)} ({num} stars)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
          <textarea
            required
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">Featured Review (show on homepage)</span>
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Review"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/reviews")}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
