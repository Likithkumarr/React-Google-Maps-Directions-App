import React from 'react'
import ReactDOM from 'react-dom/client'
/* import './index.css' */
import App from './App.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import "leaflet/dist/leaflet.css";


const root=ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <>
    <App />
  </>
)
