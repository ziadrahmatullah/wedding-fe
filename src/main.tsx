import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CheckinPage } from './pages/CheckinPage.tsx'
import { GuestbookPage } from './pages/GuestbookPage.tsx'
import { UcapanDetail } from './pages/UcapanDetail.tsx'

// Static pages, no client-side navigation between them — plain path check
// instead of a router. Hosting must rewrite these paths to index.html
// (SPA fallback) in production.
const path = window.location.pathname
const detailMatch = path.match(/^\/ucapan\/lihat\/([^/]+)/)

const page = path.startsWith('/checkin') ? (
  <CheckinPage />
) : detailMatch ? (
  <UcapanDetail id={detailMatch[1]} />
) : path.startsWith('/ucapan') ? (
  <GuestbookPage />
) : (
  <App />
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>{page}</StrictMode>,
)
