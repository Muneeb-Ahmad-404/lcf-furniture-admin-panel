"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  imageUrl: string
  price: number
  category: string
  tag: string
  inStock: boolean
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  
    const [token, setToken] = useState<string | null>(null);
    const [loadingToken, setLoadingToken] = useState(true);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("admin_token");
      setToken(storedToken);
      setLoadingToken(false);
    }, []);
  
  useEffect(() => {
    fetchProducts()
  }, [filter])

  const fetchProducts = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const url = filter ? `${API_URL}/api/products?category=${filter}` : `${API_URL}/api/products`
      console.log(url)
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
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

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
 })
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
        >
          <option value="">All Categories</option>
          <option value="beds">Beds</option>
          <option value="sofas">Sofas</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900">Rs.{product.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  {product.tag && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-[#F69F1B] text-white">
                      {product.tag}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm space-x-2">
                  <Link href={`/products/${product._id}`} className="text-blue-600 hover:text-blue-800">
                    Edit
                  </Link>
                  <button onClick={() => deleteProduct(product._id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
