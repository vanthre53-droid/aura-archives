import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { ChatWidget } from '@/components/ai/ChatWidget'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <ChatWidget />
    </>
  )
}
