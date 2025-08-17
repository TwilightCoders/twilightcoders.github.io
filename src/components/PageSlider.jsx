import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import Navigation from './Navigation';
import Carousel from './Carousel';
import PageCard from './PageCard';
import NewsletterModal from './NewsletterModal';
import NewsletterSignup from './NewsletterSignup';
import { Github, Mail } from 'lucide-react';

const PAGE_ORDER = {
  '/': 0,
  '/about': 1,
  '/contact': 2
};

// Unified page configuration - works for both mobile and desktop
const BASE_PAGES = [
  {
    path: '/',
    title: 'Projects',
    isHomePage: true,
    pageClass: 'home-page',
    content: <Carousel />,
    showOnDesktop: true,
    showOnMobile: true
  },
  {
    path: '/about',
    title: 'About Us',
    pageClass: 'about-page',
    showOnDesktop: true,
    showOnMobile: true,
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
    pageClass: 'contact-page',
    showOnDesktop: true,
    showOnMobile: true,
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
  },
  {
    path: '/newsletter',
    title: 'Stay Updated',
    isNewsletterPage: true,
    pageClass: 'newsletter-page',
    showOnDesktop: false,
    showOnMobile: true,
    content: <NewsletterSignup />
  }
];

// Helper functions for unified page system
const getFilteredPages = (isMobile) => {
  return BASE_PAGES.filter(page => isMobile ? page.showOnMobile : page.showOnDesktop);
};

const renderPageContent = (page, isMobile) => {
  const { title, content, isHomePage, isNewsletterPage } = page;
  
  if (isHomePage) {
    if (isMobile) {
      // Mobile home page includes header
      return (
        <>
          <div className="header-section">
            <h1 className="logo" data-text="TWILIGHT CODERS">TWILIGHT CODERS</h1>
            <p className="tagline">Dream. Code.</p>
          </div>
          <div className="projects-section">
            {content}
          </div>
        </>
      );
    } else {
      // Desktop home page shows only content
      return (
        <div className="projects-section">
          {content}
        </div>
      );
    }
  } else {
    // All other pages use PageCard
    return (
      <PageCard title={title}>
        {content}
      </PageCard>
    );
  }
};

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
      
      {/* Unified page slider - configuration-based rendering */}
      {(() => {
        const pages = getFilteredPages(isMobile);
        const SliderComponent = isMobile ? 'ul' : motion.ul;
        const sliderProps = isMobile ? 
          { className: "page-slider" } : 
          {
            className: "page-slider",
            initial: getTransform(),
            animate: getTransform(),
            transition: {
              duration: 0.4 * Math.abs(direction || 1),
              ease: [0.4, 0.0, 0.2, 1]
            }
          };

        return (
          <SliderComponent {...sliderProps}>
            {pages.map((page, index) => (
              <li key={page.path} className={`page-slide ${page.pageClass || ''}`}>
                {renderPageContent(page, isMobile)}
              </li>
            ))}
          </SliderComponent>
        );
      })()}
      
      {/* Newsletter Modal */}
      <NewsletterModal />
      
      {/* Copyright Footer */}
      <footer className="copyright-footer">
        © 2025 Twilight Coders, LLC
      </footer>
    </div>
  );
};

export default PageSlider;