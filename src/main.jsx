import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById("root");
rootElement.innerHTML = ""; // Clears any pre-existing content

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

