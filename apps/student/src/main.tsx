import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@elearning/shared'; // This imports global styles
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
