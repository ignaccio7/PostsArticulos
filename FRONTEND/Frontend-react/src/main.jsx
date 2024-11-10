import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fontsource/poppins'
import './index.css'
import { AuthProvider } from './context/auth.jsx'
import { ModalProvider } from './context/modal.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ModalProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ModalProvider>

)
