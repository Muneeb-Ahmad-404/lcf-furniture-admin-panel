"use client"

import { useState, useEffect } from "react"

interface Category {
  _id: string
  name: string
  displayName: string
  active: boolean
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

    const [token, setToken] = useState<string | null>(null);
    const [loadingToken, setLoadingToken] = useState(true);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("admin_token");
      setToken(storedToken);
      setLoadingToken(false);
    }, []);

  useEffect(() => {
    fetchCategories()
  }, [token]) // fetchCategories runs regardless of token

  const fetchCategories = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const headers: Record<string, string> = {}

      if (token) {
        headers.authorization = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}/api/categories`, { headers })
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
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

  const deleteCategory = async (id: string) => {
    if (!token) return alert("You must be logged in as admin to delete")
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      })
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Display Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{category.displayName}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    category.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm">
                {token && (
                  <button onClick={() => deleteCategory(category._id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
