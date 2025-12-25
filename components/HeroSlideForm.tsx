"use client"

import type React from "react"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSlideForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    link: "",
    title: "",
    order: 0,
    active: true,
  })

    const [token, setToken] = useState<string | null>(null);
    const [loadingToken, setLoadingToken] = useState(true);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("admin_token");
      setToken(storedToken);
      setLoadingToken(false);
    }, []);
  
    if (loadingToken) {
      return <div>Checking authentication...</div>; // or spinner
    }
  
    if (!token) {
      return <div>You must be logged in as admin</div>; // no alert, just render message
    }
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/hero-slides`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      })

      router.push("/hero-slides")
    } catch (error) {
      console.error("Error saving slide:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="text"
            required
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
            placeholder="/assets/hero-posters/hero-1.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Hero Slide"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/hero-slides")}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
