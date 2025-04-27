import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AkunPage from './pages/AkunPage'
import PulauPage from './pages/PulauPage'
import EventPage from './pages/EventPage'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/akun" element={<AkunPage />} />
        <Route path="/pulau" element={<PulauPage />} />
        <Route path="/event" element={<EventPage />} />
      </Routes>
    </>
  )
}

export default App
