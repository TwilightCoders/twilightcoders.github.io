import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './contexts/NavigationContext';
import StarsCanvas from './components/StarsCanvas';
import Navigation from './components/Navigation';
import IntermediatePages from './components/IntermediatePages';
import PageSlider from './components/PageSlider';
import './styles/main.scss';

function AnimatedRoutes() {
  return (
    <>
      <IntermediatePages />
      <Routes>
        <Route path="*" element={<PageSlider />} />
      </Routes>
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