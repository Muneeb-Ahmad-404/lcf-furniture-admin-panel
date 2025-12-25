"use client"

import { useState, useEffect } from "react"

export default function PageContentManager() {
  const [selectedPage, setSelectedPage] = useState("about")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

    const [token, setToken] = useState<string | null>(null);
    const [loadingToken, setLoadingToken] = useState(true);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("admin_token");
      setToken(storedToken);
      setLoadingToken(false);
    }, []);

  useEffect(() => {
    fetchPageContent()
  }, [selectedPage])

  const fetchPageContent = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_URL}/api/page-content/${selectedPage}`)
      const data = await response.json()
      setContent(JSON.stringify(data.content, null, 2))
    } catch (error) {
      console.error("Error fetching page content:", error)
      setContent("{}")
    }
  }

  if (loadingToken) {
    return <div>Checking authentication...</div>; // or spinner
  }

  if (!token) {
    return <div>You must be logged in as admin</div>; // no alert, just render message
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage("")

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/page-content/${selectedPage}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: JSON.parse(content) }),
      })
      setMessage("Content saved successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      setMessage("Error saving content. Please check JSON format.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a]"
        >
          <option value="about">About Page</option>
          <option value="contact">Contact Page</option>
          <option value="home">Home Page</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Content (JSON Format)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#103a3a] font-mono text-sm"
          placeholder="Enter JSON content..."
        />
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Content"}
      </button>
    </div>
  )
}
