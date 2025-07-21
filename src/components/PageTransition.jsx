import { motion } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';

const PageTransition = ({ children }) => {
  const { direction } = useNavigation();
  
  // Calculate positions based on direction - pages slide edge-to-edge like papers
  // Use actual distance for proper page positioning
  const getInitialX = () => {
    if (direction > 0) return `${direction * 100}%`;  // Enter from right (100%, 200%, etc.)
    if (direction < 0) return `${direction * 100}%`;  // Enter from left (-100%, -200%, etc.)
    return 0; // No movement (first load)
  };
  
  const getExitX = () => {
    if (direction > 0) return `${-direction * 100}%`; // Exit to left (-100%, -200%, etc.)
    if (direction < 0) return `${-direction * 100}%`; // Exit to right (100%, 200%, etc.)
    return 0;
  };
  
  return (
    <motion.div
      className="page-transition"
      initial={{ x: getInitialX() }}
      animate={{ x: 0 }}
      exit={{ x: getExitX() }}
      transition={{
        duration: 0.4 * Math.abs(direction || 1), // Duration scales with actual distance traveled
        ease: [0.4, 0.0, 0.2, 1] // Material Design standard easing
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;