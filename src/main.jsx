import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Profile from './pages/Profile'
import Feedback from './pages/Feedback'
import AuthCallback from './pages/AuthCallback'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Interview" element={<Interview />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
)