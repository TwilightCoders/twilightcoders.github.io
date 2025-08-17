import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsletterSignup from './NewsletterSignup';
import { Megaphone } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';
import './NewsletterModal.scss';

const NewsletterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const activeSection = useActiveSection();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleButtonClick = () => {
    if (isMobile) {
      // On mobile, scroll to the newsletter page (4th section)
      const newsletterSection = document.querySelector('.page-slide:nth-child(4)');
      if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On desktop, open modal
      setIsOpen(true);
    }
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <button 
        className={`newsletter-trigger ${activeSection === '/newsletter' ? 'active' : ''}`}
        onClick={handleButtonClick}
        aria-label="Open newsletter signup"
      >
        <Megaphone size={16} />
        Stay Updated
      </button>

      {/* Modal - only show on desktop */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            
            {/* Modal Content */}
            <motion.div
              className="modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <button 
                className="modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
              <NewsletterSignup />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterModal;