'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@/components/ui/Pagination'

interface CollectionPaginationProps {
  page: number
  totalPages: number
}

export function CollectionPagination({
  page,
  totalPages,
}: CollectionPaginationProps): React.ReactElement {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function goTo(next: number): void {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(next))
    router.push(`${pathname}?${params.toString()}`)
  }

  return <Pagination page={page} totalPages={totalPages} onPageChange={goTo} className="py-12" />
}
