import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './components/hook/LanguageContext.jsx'
import { AuthProvider } from './components/hook/Auth/AuthContext.jsx'

if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERUDA === 'true') {
  import('eruda').then((eruda) => {
    eruda.default.init()
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
