import { Routes, Route } from 'react-router-dom';  
import Nav from './assets/NavBar'; 
import Home from './pages/Home';
import Pulau from './pages/Pulau';
import EventBudaya from './pages/EventBudaya';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Nav />  {/* Komponen Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pulau" element={<Pulau />} />
        <Route path="/eventbudaya" element={<EventBudaya />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
