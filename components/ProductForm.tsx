"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ProductFormProps {
  productId?: string
} 

interface categoryInter {
  _id: string
  name: string
  displayName: string
  description: string,
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    imageFile: null as File | null,
    price: "",
    oldPrice: "",
    category: "beds",
    tag: "",
    description: "",
    specifications: [{ label: "", value: "" }],
    inStock: true,
    featured: false,
  })

  const [token, setToken] = useState<string | null>(null)
  const [loadingToken, setLoadingToken] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<categoryInter[]>([])

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token")
    setToken(storedToken)
    setLoadingToken(false)
  }, [])

  useEffect(() => {
    if (productId) fetchProduct()
  }, [productId])

  useEffect(() => {
    fetchCategories()
  }, [])


  const fetchProduct = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${API_URL}/api/products/${productId}`)
      if (!res.ok) throw new Error("Failed to fetch product data")
      const data = await res.json()
      setFormData({
        name: data.name,
        imageFile: null,
        price: data.price.toString(),
        oldPrice: data.oldPrice?.toString() || "",
        category: data.category,
        tag: data.tag || "",
        description: data.description,
        specifications: data.specifications.length ? data.specifications : [{ label: "", value: "" }],
        inStock: data.inStock,
        featured: data.featured,
      })
    } catch (err: any) {
      setError(err.message || "Unknown error fetching product")
    }
  }

  const fetchCategories = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${API_URL}/api/categories/`)
      if (!res.ok) throw new Error("Failed to fetch product data")
      setCategories(await res.json());
    } catch (err: any) {
      setError(err.message || "Unknown error fetching product")
    }
  }

  if (loadingToken) return <div>Checking authentication...</div>
  if (!token) return <div>You must be logged in as admin</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required")
      return
    }
    if (!formData.price || Number.isNaN(Number(formData.price))) {
      setError("Valid price is required")
      return
    }
    if (!productId && !formData.imageFile) {
      setError("Product image is required")
      return
    }

    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const url = productId ? `${API_URL}/api/products/${productId}` : `${API_URL}/api/products`
      const method = productId ? "PUT" : "POST"

      const payload = new FormData()
      payload.append("name", formData.name)
      payload.append("price", formData.price)
      if (formData.oldPrice) payload.append("oldPrice", formData.oldPrice)
      payload.append("category", formData.category)
      payload.append("tag", formData.tag)
      payload.append("description", formData.description)
      payload.append("inStock", formData.inStock.toString())
      payload.append("featured", formData.featured.toString())
      payload.append("specifications", JSON.stringify(formData.specifications.filter(s => s.label && s.value)))
      if (formData.imageFile) payload.append("image", formData.imageFile)

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Unknown error saving product")
      }

      router.push("/products")
    } catch (err: any) {
      setError(err.message || "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addSpecification = () => setFormData({
    ...formData,
    specifications: [...formData.specifications, { label: "", value: "" }],
  })

  const removeSpecification = (index: number) => setFormData({
    ...formData,
    specifications: formData.specifications.filter((_, i) => i !== index),
  })

  const updateSpecification = (index: number, field: "label" | "value", value: string) => {
    const updated = [...formData.specifications]
    updated[index][field] = value
    setFormData({ ...formData, specifications: updated })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-4xl space-y-6">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs)</label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Old Price (Rs) - Optional</label>
          <input
            type="number"
            value={formData.oldPrice}
            onChange={e => setFormData({ ...formData, oldPrice: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          >
            {
              categories.map((category) => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))
            }
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
          <select
            value={formData.tag}
            onChange={e => setFormData({ ...formData, tag: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
          >
            <option value="">No Tag</option>
            <option value="New">New</option>
            <option value="Hot">Hot</option>
            <option value="Sale">Sale</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          required
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
        {formData.specifications.map((spec, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Label (e.g., Size)"
              value={spec.label}
              onChange={e => updateSpecification(index, "label", e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
            />
            <input
              type="text"
              placeholder="Value (e.g., King)"
              value={spec.value}
              onChange={e => updateSpecification(index, "value", e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
            />
            <button type="button" onClick={() => removeSpecification(index)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addSpecification} className="mt-2 text-[#103a3a] hover:underline text-sm">+ Add Specification</button>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4"/>
          <span className="text-sm font-medium text-gray-700">In Stock</span>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4"/>
          <span className="text-sm font-medium text-gray-700">Featured Product</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors disabled:opacity-50">
          {loading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.push("/products")} className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </form>
  )
}
