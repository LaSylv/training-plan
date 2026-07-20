import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sert le site sous /training-plan/ (repo LaSylv/training-plan).
// En dev (npm run dev) on garde la racine.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/training-plan/' : '/',
  plugins: [react()],
}))
