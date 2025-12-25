import ProductForm from "@/components/ProductForm"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>
      <ProductForm productId={id} />
    </div>
  )
}
