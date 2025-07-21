import PageTransition from '../components/PageTransition';
import PageCard from '../components/PageCard';

const Contact = () => {
  return (
    <PageTransition>
      <div className="content-overlay">
        <PageCard title="Get In Touch">
          <p>
            Interested in collaborating, have questions about our projects, or want to discuss 
            a development opportunity? We'd love to hear from you.
          </p>
          
          <h3>Connect With Us</h3>
          <div className="contact-links">
            <a href="https://github.com/TwilightCoders" className="contact-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="mailto:hello@twilightcoders.dev" className="contact-link">
              Email
            </a>
          </div>
          
          <h3>What We're Looking For</h3>
          <ul>
            <li>Open source collaborations and community contributions</li>
            <li>Interesting technical challenges and innovative projects</li>
            <li>Opportunities to share knowledge and learn from others</li>
            <li>Creative partnerships that push the boundaries of development</li>
          </ul>
          
          <p>
            Whether you're looking to contribute to our projects, need technical expertise, 
            or just want to chat about code—drop us a line. We aim to respond within 24-48 hours.
          </p>
        </PageCard>
      </div>
    </PageTransition>
  );
};

export default Contact;