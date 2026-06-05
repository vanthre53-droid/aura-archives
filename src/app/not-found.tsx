import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <p className="font-serif text-6xl">404</p>
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl">This page has left the archive</h1>
        <p className="text-sm text-text-muted">
          The piece you are looking for may have moved or is no longer available.
        </p>
      </div>
      <Button asChild variant="primary">
        <Link href="/">Return home</Link>
      </Button>
    </main>
  )
}
