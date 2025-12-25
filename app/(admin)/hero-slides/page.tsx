import HeroSlideList from "@/components/HeroSlideList"
import Link from "next/link"

export default function HeroSlidesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
        <Link
          href="/hero-slides/new"
          className="bg-[#103a3a] text-white px-6 py-3 rounded-lg hover:bg-[#0d2e2e] transition-colors"
        >
          Add New Slide
        </Link>
      </div>
      <HeroSlideList />
    </div>
  )
}
