import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import Navigation from './Navigation';
import Carousel from './Carousel';
import PageCard from './PageCard';
import NewsletterModal from './NewsletterModal';
import { Github, Mail } from 'lucide-react';

const PAGE_ORDER = {
  '/': 0,
  '/about': 1,
  '/contact': 2
};

const PAGES = [
  {
    path: '/',
    title: 'Projects',
    isHomePage: true,
    content: <Carousel />
  },
  {
    path: '/about',
    title: 'About Us',
    content: (
      <>
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
      </>
    )
  },
  {
    path: '/contact',
    title: 'Get In Touch',
    content: (
      <>
        <p>
          Interested in collaborating, have questions about our projects, or want to discuss 
          a development opportunity? We'd love to hear from you.
        </p>
        
        <div className="contact-links">
          <a href="https://github.com/TwilightCoders" className="contact-link" target="_blank" rel="noopener noreferrer">
            <Github size={16} />
            GitHub
          </a>
          <a href="mailto:hello@twilightcoders.dev" className="contact-link">
            <Mail size={16} />
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
      </>
    )
  }
];


const PageSlider = () => {
  const location = useLocation();
  const { direction } = useNavigation();
  const [isMobile, setIsMobile] = useState(false);
  
  const currentIndex = PAGE_ORDER[location.pathname] || 0;
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      const userAgent = navigator.userAgent;
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      console.log(`Mobile check: 
        window.innerWidth=${window.innerWidth}
        screen.width=${screen.width}
        userAgent mobile=${isMobileUA}
        final isMobile=${isMobileDevice}
        userAgent=${userAgent}`);
      
      setIsMobile(isMobileDevice);
      
      // Add/remove mobile class on body for CSS targeting
      if (isMobileDevice) {
        document.body.classList.add('mobile-device');
        document.body.classList.remove('desktop-device');
      } else {
        document.body.classList.add('desktop-device');
        document.body.classList.remove('mobile-device');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const getTransform = () => {
    if (isMobile) {
      // Mobile: vertical scrolling - no transform needed, let CSS handle it
      return { x: 0, y: 0 };
    } else {
      // Desktop: horizontal sliding
      const adjustedIndex = currentIndex - 1;
      return { x: `${-adjustedIndex * 100}vw` };
    }
  };
  
  return (
    <div className="content-overlay">
      <div className="navigation-mobile">
        <Navigation />
      </div>
      {/* Header section - only show on desktop */}
      {!isMobile && (
        <div className="header-section">
          <h1 className="logo" data-text="TWILIGHT CODERS">TWILIGHT CODERS</h1>
          <p className="tagline">Dream. Code.</p>
        </div>
      )}
      
      {isMobile ? (
        <ul className="page-slider">
          {PAGES.map(({ path, title, content, isHomePage }, index) => (
            <li key={path} className="page-slide">
              {isHomePage ? (
                <>
                  <div className="header-section">
                    <h1 className="logo" data-text="TWILIGHT CODERS">TWILIGHT CODERS</h1>
                    <p className="tagline">Dream. Code.</p>
                  </div>
                  <div className="projects-section">
                    {content}
                  </div>
                </>
              ) : (
                <PageCard title={title}>
                  {content}
                </PageCard>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <motion.ul
          className="page-slider"
          initial={getTransform()} // Set initial position immediately to prevent flash
          animate={getTransform()}
          transition={{
            duration: 0.4 * Math.abs(direction || 1),
            ease: [0.4, 0.0, 0.2, 1]
          }}
        >
          {PAGES.map(({ path, title, content, isHomePage }, index) => (
            <li key={path} className="page-slide">
              {isHomePage ? (
                <div className="projects-section">
                  {content}
                </div>
              ) : (
                <PageCard title={title}>
                  {content}
                </PageCard>
              )}
            </li>
          ))}
        </motion.ul>
      )}
      
      {/* Newsletter Modal */}
      <NewsletterModal />
    </div>
  );
};

export default PageSlider;