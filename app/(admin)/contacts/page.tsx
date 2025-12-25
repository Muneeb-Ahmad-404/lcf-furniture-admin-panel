"use client"

import { useState, useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "read" | "replied"
  createdAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [token, setToken] = useState<string | null>(null)
  const [loadingToken, setLoadingToken] = useState(true)

  // Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token")
    setToken(storedToken)
    setLoadingToken(false)
  }, [])

  // Fetch contacts once token is available or filter changes
  useEffect(() => {
    if (!token) return
    fetchContacts()
  }, [token, filter])

  if (loadingToken) {
    return <div>Checking authentication...</div>
  }

  if (!token) {
    return <div>You must be logged in as admin</div>
  }

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const url = filter === "all" ? `${API_URL}/api/contact` : `${API_URL}/api/contact?status=${filter}`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      fetchContacts()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    try {
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchContacts()
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <div className="flex gap-2">
          {["all", "new", "read", "replied"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded ${filter === f ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{contact.email}</td>
                <td className="px-6 py-4">{contact.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(contact.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus(contact._id, e.target.value)}
                    className="mr-2 px-2 py-1 border rounded"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <button onClick={() => deleteContact(contact._id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && <div className="text-center py-8 text-gray-500">No contact messages found</div>}
      </div>
    </div>
  )
}
