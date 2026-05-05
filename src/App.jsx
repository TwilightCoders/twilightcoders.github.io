import StarsCanvas from './components/StarsCanvas';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import OpenSourceSection from './components/OpenSourceSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import './styles/main.scss';

function App() {
  return (
    <div className="App">
      <StarsCanvas />
      <HeroSection />
      <main>
        <ProductsSection />
        <OpenSourceSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
