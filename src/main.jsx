import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts, Latin subset only (covers Spanish accents, ñ and ¿).
// Served from the site itself, so the headline never falls back to a wider
// system font because a third-party request was slow or blocked.
import '@fontsource/anton/latin-400.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './lib/analytics'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

initAnalytics()
