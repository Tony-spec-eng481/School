import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@elearning/shared'; // This imports global styles
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
