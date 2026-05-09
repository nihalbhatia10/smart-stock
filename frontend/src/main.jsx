import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <App />
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1E293B', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
    </StoreProvider>
  </StrictMode>,
)
