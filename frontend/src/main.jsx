import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
=======
import { BrowserRouter } from 'react-router-dom';
>>>>>>> f99256bbc7ba6e39f3bbf4f206d96a8941b49b2d
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
