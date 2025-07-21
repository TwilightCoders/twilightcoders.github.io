import PageTransition from '../components/PageTransition';
import PageCard from '../components/PageCard';

const About = () => {
  return (
    <PageTransition>
      <div className="content-overlay">
        <PageCard title="About Us">
          <p>
            We're a creative development collective focused on building innovative web solutions 
            and contributing to the open-source community. Our passion lies in crafting elegant 
            code that solves real problems and pushes the boundaries of what's possible.
          </p>
          
          <h3>What We Create</h3>
          <ul>
            <li>Modern web applications with cutting-edge technologies</li>
            <li>Open-source tools and libraries for developers</li>
            <li>Automation solutions that enhance productivity</li>
            <li>Creative experiments that explore new possibilities</li>
          </ul>
          
          <p>
            From React applications to Ruby gems, from AI integrations to developer tools—we 
            believe in the power of thoughtful engineering and clean architecture to create 
            software that stands the test of time.
          </p>
        </PageCard>
      </div>
    </PageTransition>
  );
};

export default About;