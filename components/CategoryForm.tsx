"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CategoryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    active: true,
  })

  // Get token from localStorage after mount
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
    if (!token) {
      alert("You must be logged in as admin")
      return
    }

    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error saving category:", errorData)
        alert(errorData.message || "Failed to create category")
        return
      }

      router.push("/categories")
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Name (lowercase)</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
            placeholder="beds"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <input
            type="text"
            required
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
            placeholder="Beds"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
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
            {loading ? "Saving..." : "Create Category"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
