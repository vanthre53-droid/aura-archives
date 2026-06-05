'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Input, Textarea } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { FormError } from '@/components/forms/FormError'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import type { Category, Product } from '@/types/shop.types'

interface ProductFormProps {
  mode: 'create' | 'edit'
  categories: Category[]
  product?: Product
}

interface ProductFormValues {
  name: string
  slug: string
  category_id: string
  price: string
  compare_at_price: string
  stock_quantity: string
  sort_order: string
  tagline: string
  description: string
  details: string
  images: string
  sizes: string
  tags: string
  is_active: boolean
  is_featured: boolean
}

const splitLines = (value: string): string[] =>
  value.split('\n').map((line) => line.trim()).filter(Boolean)
const splitCommas = (value: string): string[] =>
  value.split(',').map((entry) => entry.trim()).filter(Boolean)

function toDefaults(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category_id: product?.category_id ?? '',
    price: product ? String(product.price) : '',
    compare_at_price: product?.compare_at_price != null ? String(product.compare_at_price) : '',
    stock_quantity: product ? String(product.stock_quantity) : '0',
    sort_order: product?.sort_order != null ? String(product.sort_order) : '0',
    tagline: product?.tagline ?? '',
    description: product?.description ?? '',
    details: (product?.details ?? []).join('\n'),
    images: (product?.images ?? []).join('\n'),
    sizes: (product?.sizes ?? []).join(', '),
    tags: (product?.tags ?? []).join(', '),
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  }
}

export function ProductForm({ mode, categories, product }: ProductFormProps): React.ReactElement {
  const router = useRouter()
  const { toast } = useToast()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({ defaultValues: toDefaults(product) })

  async function onSubmit(values: ProductFormValues): Promise<void> {
    setFormError(null)
    const payload = {
      name: values.name,
      slug: values.slug.trim() || undefined,
      category_id: values.category_id || null,
      price: Number(values.price),
      compare_at_price: values.compare_at_price ? Number(values.compare_at_price) : null,
      currency: 'INR',
      stock_quantity: Number(values.stock_quantity) || 0,
      sort_order: Number(values.sort_order) || 0,
      tagline: values.tagline,
      description: values.description,
      details: splitLines(values.details),
      images: splitLines(values.images),
      sizes: splitCommas(values.sizes),
      tags: splitCommas(values.tags),
      is_active: values.is_active,
      is_featured: values.is_featured,
    }

    try {
      const endpoint = mode === 'create' ? '/api/v1/products' : `/api/v1/products/${product?.id}`
      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await response.json()) as { success: boolean; error?: string }
      if (!response.ok || !json.success) {
        setFormError(json.error ?? 'Could not save the product.')
        return
      }
      toast({
        title: mode === 'create' ? 'Product created' : 'Product updated',
        variant: 'success',
      })
      router.push('/admin/products')
      router.refresh()
    } catch {
      setFormError('Could not save the product. Please try again.')
    }
  }

  const inputClass =
    'h-11 w-full border border-border bg-surface px-3 text-sm text-text focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-5" noValidate>
      <FormField htmlFor="name" label="Name" error={errors.name?.message} required>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name', { required: 'Enter a product name.' })} />
      </FormField>

      <FormField htmlFor="slug" label="Slug" hint="Leave blank to generate from the name.">
        <Input id="slug" placeholder="auto-generated" {...register('slug')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField htmlFor="price" label="Price (INR)" error={errors.price?.message} required>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            aria-invalid={Boolean(errors.price)}
            {...register('price', { required: 'Enter a price.' })}
          />
        </FormField>
        <FormField htmlFor="compare_at_price" label="Compare-at price">
          <Input id="compare_at_price" type="number" step="0.01" min="0" {...register('compare_at_price')} />
        </FormField>
        <FormField htmlFor="stock_quantity" label="Stock">
          <Input id="stock_quantity" type="number" min="0" {...register('stock_quantity')} />
        </FormField>
        <FormField htmlFor="sort_order" label="Sort order">
          <Input id="sort_order" type="number" {...register('sort_order')} />
        </FormField>
      </div>

      <FormField htmlFor="category_id" label="Category">
        <select id="category_id" className={cn(inputClass)} {...register('category_id')}>
          <option value="">— None —</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField htmlFor="tagline" label="Tagline">
        <Input id="tagline" {...register('tagline')} />
      </FormField>

      <FormField htmlFor="description" label="Description">
        <Textarea id="description" {...register('description')} />
      </FormField>

      <FormField htmlFor="details" label="Details" hint="One per line.">
        <Textarea id="details" {...register('details')} />
      </FormField>

      <FormField htmlFor="images" label="Image URLs" hint="One URL per line.">
        <Textarea id="images" {...register('images')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField htmlFor="sizes" label="Sizes" hint="Comma-separated.">
          <Input id="sizes" {...register('sizes')} />
        </FormField>
        <FormField htmlFor="tags" label="Tags" hint="Comma-separated.">
          <Input id="tags" {...register('tags')} />
        </FormField>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-primary" {...register('is_active')} />
          Active (visible in the storefront)
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-primary" {...register('is_featured')} />
          Featured
        </label>
      </div>

      <FormError message={formError ?? undefined} />

      <div className="flex items-center gap-3">
        <SubmitButton isLoading={isSubmitting}>
          {mode === 'create' ? 'Create product' : 'Save changes'}
        </SubmitButton>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/products')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
