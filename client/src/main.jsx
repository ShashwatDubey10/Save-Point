import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for offline support and faster loads
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('App is ready for offline use')
  },
  onUpdate: (registration) => {
    console.log('New version available! Please refresh the page.')
    // Optionally auto-update
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }
})
