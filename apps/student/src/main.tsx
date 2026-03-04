import { ViteReactSSG } from 'vite-react-ssg'
import '@elearning/shared'; // This imports global styles
import { HelmetProvider } from 'react-helmet-async';
import App, { routes } from './App.tsx'

export const createRoot = ViteReactSSG(
  {
    routes,
  },
  () => {
    // Initial initialization logic here (e.g. data fetching)
  }
)
