import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fontsource/poppins'
import './index.css'
import { AuthProvider } from './context/auth.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>

)
