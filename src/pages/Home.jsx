import Carousel from '../components/Carousel';
import PageTransition from '../components/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <div className="content-overlay">
        <p className="tagline">Dream. Code.</p>
        
        <div className="projects-section">
          <div className="carousel-container">
            <Carousel />
          </div>
        </div>
        
      </div>
    </PageTransition>
  );
};

export default Home;