import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { NavigationProvider } from './contexts/NavigationContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import StarsCanvas from './components/StarsCanvas';
import Navigation from './components/Navigation';
import IntermediatePages from './components/IntermediatePages';
import './styles/main.scss';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <>
      <IntermediatePages />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <StarsCanvas />
      <Router>
        <NavigationProvider>
          <Navigation />
          <AnimatedRoutes />
        </NavigationProvider>
      </Router>
    </div>
  );
}

export default App;