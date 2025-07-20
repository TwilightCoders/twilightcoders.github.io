import PageTransition from '../components/PageTransition';
import PageCard from '../components/PageCard';

const About = () => {
  return (
    <PageTransition>
      <div className="content-overlay">
        <h1 className="logo" data-text="TWILIGHT CODERS">TWILIGHT CODERS</h1>
        
        <PageCard title="About Us">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          
          <h3>Our Mission</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          
          <h3>What We Do</h3>
          <ul>
            <li>Innovative software development and creative coding solutions</li>
            <li>Open-source contributions to the developer community</li>
            <li>Modern architecture and best practices implementation</li>
            <li>AI-powered automation and productivity tools</li>
          </ul>
          
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
            architecto beatae vitae dicta sunt explicabo.
          </p>
        </PageCard>
      </div>
    </PageTransition>
  );
};

export default About;