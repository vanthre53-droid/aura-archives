import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategories, getProductByIdAdmin } from '@/services/product.service'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}): Promise<React.ReactElement> {
  const [product, categories] = await Promise.all([
    getProductByIdAdmin(params.id),
    getCategories(),
  ])
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <Link href="/admin/products" className="text-xs uppercase tracking-widest text-text-muted hover:text-text">
          ← Products
        </Link>
        <h1 className="font-serif text-3xl">Edit product</h1>
        <p className="text-sm text-text-muted">{product.name}</p>
      </header>
      <ProductForm mode="edit" categories={categories} product={product} />
    </div>
  )
}
