import { motion } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';

const PageTransition = ({ children }) => {
  const { direction } = useNavigation();
  
  // Calculate positions based on direction and distance
  const getInitialX = () => {
    if (direction > 0) return `${direction * 100}%`;  // Start further right for longer distances
    if (direction < 0) return `${direction * 100}%`; // Start further left for longer distances
    return 0; // No movement (first load)
  };
  
  const getExitX = () => {
    if (direction > 0) return `${-direction * 100}%`; // Exit further left
    if (direction < 0) return `${-direction * 100}%`; // Exit further right
    return 0;
  };
  
  return (
    <motion.div
      className="page-transition"
      initial={{ x: getInitialX() }}
      animate={{ x: 0 }}
      exit={{ x: getExitX() }}
      transition={{
        duration: Math.abs(direction) * 0.15 + 0.25, // Faster: 0.4s for adjacent, 0.55s for skip one
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;