import { useState, useEffect } from 'react';

/**
 * Custom hook to track which section is currently active
 * Works on both mobile (scroll-based) and desktop (route-based)
 * @returns {string} The path of the currently active section
 */
export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('/');

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      // Desktop: track route changes by listening to router navigation
      const currentPath = window.location.pathname;
      setActiveSection(currentPath);
      
      // Listen for route changes and custom navigation events
      const handleRouteChange = () => {
        setActiveSection(window.location.pathname);
      };
      
      const handlePageChange = (event) => {
        setActiveSection(event.detail.path);
      };
      
      window.addEventListener('popstate', handleRouteChange);
      window.addEventListener('pageChanged', handlePageChange);
      
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
        window.removeEventListener('pageChanged', handlePageChange);
      };
    }

    // Listen for manual page change events from navigation clicks
    const handlePageChange = (event) => {
      setActiveSection(event.detail.path);
    };
    
    window.addEventListener('pageChanged', handlePageChange);

    // Simple scroll detection - check which page is in view
    const checkActiveSection = () => {
      const pageSlides = document.querySelectorAll('.page-slide');
      
      if (pageSlides.length === 0) {
        return;
      }
      
      // Find which page slide is currently most visible
      let mostVisibleSlide = null;
      let maxVisibleHeight = 0;
      
      pageSlides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the slide is visible
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          mostVisibleSlide = slide;
        }
      });
      
      if (mostVisibleSlide) {
        let newSection = '/';
        
        if (mostVisibleSlide.classList.contains('home-page')) {
          newSection = '/';
        } else if (mostVisibleSlide.classList.contains('about-page')) {
          newSection = '/about';
        } else if (mostVisibleSlide.classList.contains('contact-page')) {
          newSection = '/contact';
        } else if (mostVisibleSlide.classList.contains('newsletter-page')) {
          newSection = '/newsletter';
        }
        
        setActiveSection(newSection);
      }
    };
    
    // Check on scroll with debouncing
    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(checkActiveSection, 50);
    };
    
    // Listen for scroll on the content-overlay container (the one that actually scrolls)
    const scrollContainer = document.querySelector('.content-overlay');
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    // Check initially
    checkActiveSection();
    
    return () => {
      window.removeEventListener('pageChanged', handlePageChange);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(scrollTimer);
    };
  }, []);

  return activeSection;
};