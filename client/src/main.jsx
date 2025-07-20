import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReceptionContextProvider from './context/ReceptionContext'
import AuthContextProvider from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContextProvider>
  <ReceptionContextProvider>
    <App />
  </ReceptionContextProvider>
  </AuthContextProvider>
  </BrowserRouter>,
)
