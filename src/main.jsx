import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ServicesProvider } from './context/ServicesContext'
import { ThemeProvider } from './context/ThemeContext'
import { MatchProvider } from './context/MatchContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MatchProvider>
        <ServicesProvider>
          <App />
        </ServicesProvider>
      </MatchProvider>
    </ThemeProvider>
  </StrictMode>,
)
