import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUIStore = create(persist((set) => ({
  soundEnabled: false,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}), {
  name: 'harmonious-home-ui-v1',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ soundEnabled: state.soundEnabled }),
}))
