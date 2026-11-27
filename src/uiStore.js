import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUIStore = create(persist((set) => ({
  soundEnabled: false,
  speechVoice: 'en-US-AvaNeural',
  speechRate: 1,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setSpeechVoice: (speechVoice) => set({ speechVoice }),
  setSpeechRate: (speechRate) => set({ speechRate }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}), {
  name: 'harmonious-home-ui-v1',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ soundEnabled: state.soundEnabled, speechVoice:state.speechVoice, speechRate:state.speechRate }),
}))
