import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test component
function TestApp() {
  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      <h1>Test App Working!</h1>
      <p>If you see this, React is mounting correctly.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
