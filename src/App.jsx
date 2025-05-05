import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/home'
import EventBudaya from './pages/eventbudaya'
import DetailEvent from './pages/Detailevent'
import Pulau from './pages/pulau'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/eventbudaya" element={<EventBudaya/>} />
            <Route path="/Detailevent" element={<DetailEvent />} />
            <Route path="/pulau" element={<Pulau />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App