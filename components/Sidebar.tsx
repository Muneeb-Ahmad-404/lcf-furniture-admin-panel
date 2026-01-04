"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token")
    if (storedToken) {
      setToken(storedToken)
      setIsLoggedIn(true)
    } else {
      setToken(null)
      setIsLoggedIn(false)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("admin_token")
    setIsLoggedIn(false)
    router.push("/login")
  }

  // Close sidebar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const menuItems = [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Products", href: "/products", icon: "📦" },
    { label: "Categories", href: "/categories", icon: "📂" },
    { label: "Hero Slides", href: "/hero-slides", icon: "🖼️" },
    { label: "Page Content", href: "/page-content", icon: "📄" },
    { label: "Contact Messages", href: "/contacts", icon: "✉️" },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#F69F1B] text-white rounded-lg shadow-md md:hidden"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Sidebar */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 w-64 bg-[#103a3a] text-white h-full p-6 z-50 transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:h-auto md:w-64`}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold">LCF Admin</h2>
          <p className="text-sm text-gray-300">Furniture Management</p>

          <button
            onClick={isLoggedIn ? handleSignOut : () => router.push("/login")}
            className="mt-4 w-full bg-[#F69F1B] text-white py-2 rounded hover:opacity-90 transition-colors"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-[#F69F1B] text-white" : "hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
