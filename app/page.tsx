import Link from "next/link"

export default function Dashboard() {
  const stats = [
    { label: "Total Products", value: "---", link: "/products", icon: "📦" },
    { label: "Categories", value: "---", link: "/categories", icon: "📂" },
    { label: "Hero Slides", value: "---", link: "/hero-slides", icon: "🖼️" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/products/new"
            className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors text-center"
          >
            Add New Product
          </Link>
          <Link
            href="/hero-slides/new"
            className="bg-[#F69F1B] text-white px-6 py-3 rounded-lg hover:bg-[#e08d0a] transition-colors text-center"
          >
            Add Hero Slide
          </Link>
          <Link
            href="/page-content"
            className="border-2 border-gray-300 px-6 py-3 rounded-lg hover:border-[#103a3a] transition-colors text-center"
          >
            Edit Page Content
          </Link>
        </div>
      </div>
    </div>
  )
}
