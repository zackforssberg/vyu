import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isSidebarOpen: boolean
  sidebarMode: 'expanded' | 'collapsed'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSidebarMode: (mode: 'expanded' | 'collapsed') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      sidebarMode: 'expanded',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setSidebarMode: (mode) => set({ sidebarMode: mode }),
    }),
    {
      name: 'ui-storage',
    }
  )
)

interface UserPreferenceState {
  currency: string
  setCurrency: (currency: string) => void
}

export const useUserPreferenceStore = create<UserPreferenceState>()(
  persist(
    (set) => ({
      currency: 'SEK',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'user-preferences',
    }
  )
)
