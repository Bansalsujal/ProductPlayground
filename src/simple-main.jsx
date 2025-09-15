import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Simple components without complex imports
function SimpleHome() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>PM Interview Practice</h1>
      <p>Home page working!</p>
    </div>
  )
}

function SimpleLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
        <h1>PM Interview Practice</h1>
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SimpleLayout>
        <Routes>
          <Route path="/" element={<SimpleHome />} />
          <Route path="/Home" element={<SimpleHome />} />
        </Routes>
      </SimpleLayout>
    </BrowserRouter>
  </React.StrictMode>,
)
