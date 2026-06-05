import Link from 'next/link'
import { getCategories } from '@/services/product.service'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage(): Promise<React.ReactElement> {
  const categories = await getCategories()

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <Link href="/admin/products" className="text-xs uppercase tracking-widest text-text-muted hover:text-text">
          ← Products
        </Link>
        <h1 className="font-serif text-3xl">New product</h1>
      </header>
      <ProductForm mode="create" categories={categories} />
    </div>
  )
}
