import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // The app is hosted at the domain root; absolute assets keep deep /app/* routes working on refresh.
  base: '/',
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: {
    include: [
      'motion/react', 'lucide-react', 'sonner', '@tanstack/react-query',
      'zustand', 'zod', '@dnd-kit/core', '@dnd-kit/sortable',
      '@dnd-kit/utilities', 'recharts', '@xyflow/react', '@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-placeholder',
    ],
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 850,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-is|scheduler)[\\/]/, priority: 30 },
            { name: 'motion-vendor', test: /node_modules[\\/]motion[\\/]/, priority: 25 },
            { name: 'charts-vendor', test: /node_modules[\\/](recharts|d3-[^\\/]+)[\\/]/, priority: 24 },
            { name: 'dragdrop-vendor', test: /node_modules[\\/]@dnd-kit[\\/]/, priority: 23 },
            { name: 'ui-vendor', test: /node_modules[\\/](lucide-react|sonner)[\\/]/, priority: 22 },
            { name: 'state-vendor', test: /node_modules[\\/](@tanstack[\\/]react-query|zustand|zod)[\\/]/, priority: 21 },
            { name: 'kokoro-vendor', test: /node_modules[\\/](kokoro-js|onnxruntime-web)[\\/]/, priority: 27 },
            { name: 'flow-vendor', test: /node_modules[\\/]@xyflow[\\/]/, priority: 24 },
            { name: 'editor-vendor', test: /node_modules[\\/]@tiptap[\\/]/, priority: 23 },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 1 },
          ],
        },
      },
    },
  },
})
