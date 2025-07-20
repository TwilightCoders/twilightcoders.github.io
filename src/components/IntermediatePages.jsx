import { motion } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';
import About from '../pages/About';
import Home from '../pages/Home';
import Contact from '../pages/Contact';

const PAGE_COMPONENTS = {
  0: Home,
  1: About, 
  2: Contact
};

const IntermediatePages = () => {
  const { direction } = useNavigation();
  
  // Only show intermediate pages if we're skipping (direction > 1 or < -1)
  if (Math.abs(direction) <= 1) return null;
  
  const intermediatePages = [];
  
  // Calculate which pages to show flying by
  if (direction > 1) {
    // Moving right, show pages in between
    for (let i = 1; i < direction; i++) {
      const PageComponent = PAGE_COMPONENTS[i];
      if (PageComponent) {
        intermediatePages.push(
          <motion.div
            key={`intermediate-${i}`}
            className="page-transition intermediate-page"
            initial={{ x: `${(i + 1) * 100}%` }}
            animate={{ x: `${(i - direction) * 100}%` }}
            transition={{
              duration: Math.abs(direction) * 0.15 + 0.25,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <PageComponent />
          </motion.div>
        );
      }
    }
  } else if (direction < -1) {
    // Moving left, show pages in between
    for (let i = -1; i > direction; i--) {
      const pageIndex = Math.abs(i);
      const PageComponent = PAGE_COMPONENTS[pageIndex];
      if (PageComponent) {
        intermediatePages.push(
          <motion.div
            key={`intermediate-${i}`}
            className="page-transition intermediate-page"
            initial={{ x: `${(i - 1) * 100}%` }}
            animate={{ x: `${(i - direction) * 100}%` }}
            transition={{
              duration: Math.abs(direction) * 0.15 + 0.25,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <PageComponent />
          </motion.div>
        );
      }
    }
  }
  
  return <>{intermediatePages}</>;
};

export default IntermediatePages;