"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSlideForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    imageFile: null as File | null,
    title: "",
    order: 0,
    active: true,
  })

  const [token, setToken] = useState<string | null>(null)
  const [loadingToken, setLoadingToken] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token")
    setToken(storedToken)
    setLoadingToken(false)
  }, [])

  if (loadingToken) return <div>Checking authentication...</div>
  if (!token) return <div>You must be logged in as admin</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      const data = new FormData()
      if (formData.imageFile) {
        data.append("image", formData.imageFile)
      }
      data.append("title", formData.title)
      data.append("order", String(formData.order))
      data.append("active", String(formData.active))

      const res = await fetch(`${API_URL}/api/hero-slides`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create hero slide")
      }

      router.push("/hero-slides")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 max-w-2xl"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-md font-medium mb-2">
            Hero Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                imageFile: e.target.files?.[0] || null,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({
                ...formData,
                order: Number(e.target.value),
              })
            }
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) =>
              setFormData({
                ...formData,
                active: e.target.checked,
              })
            }
          />
          Active
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#103a3a] text-white px-6 py-3 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Hero Slide"}
        </button>
      </div>
    </form>
  )
}
