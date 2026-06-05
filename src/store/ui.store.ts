import { create } from 'zustand'

interface UiState {
  cartDrawerOpen: boolean
  searchOpen: boolean
  chatOpen: boolean
  setCartDrawerOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setChatOpen: (open: boolean) => void
  toggleChat: () => void
}

export const useUiStore = create<UiState>((set) => ({
  cartDrawerOpen: false,
  searchOpen: false,
  chatOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setChatOpen: (open) => set({ chatOpen: open }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
}))
