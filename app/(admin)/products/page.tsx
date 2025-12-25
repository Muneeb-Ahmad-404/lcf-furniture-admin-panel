import ProductList from "@/components/ProductList"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/products/new"
          className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors"
        >
          Add New Product
        </Link>
      </div>
      <ProductList />
    </div>
  )
}
