"use client"

import { useState, useEffect } from "react"

interface HeroSlide {
  _id: string
  link: string
  title?: string
  order: number
  active: boolean
}

export default function HeroSlideList() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

    const [token, setToken] = useState<string | null>(null);
    const [loadingToken, setLoadingToken] = useState(true);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("admin_token");
      setToken(storedToken);
      setLoadingToken(false);
    }, []);
  
  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_URL}/api/hero-slides`)
      const data = await response.json()
      setSlides(data)
    } catch (error) {
      console.error("Error fetching slides:", error)
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

  const deleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/hero-slides/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
 })
      fetchSlides()
    } catch (error) {
      console.error("Error deleting slide:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image URL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {slides.map((slide) => (
            <tr key={slide._id}>
              <td className="px-6 py-4">
                <img
                  src={slide.link || "/placeholder.svg"}
                  alt="Hero slide"
                  className="w-24 h-16 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{slide.link}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{slide.order}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    slide.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {slide.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm">
                <button onClick={() => deleteSlide(slide._id)} className="text-red-600 hover:text-red-800">
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
