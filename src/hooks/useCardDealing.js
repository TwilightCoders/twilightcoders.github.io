import { useState, useEffect } from 'react';

/**
 * Custom hook for managing card dealing animations and stack/carousel positioning
 * @param {Array} projects - Array of project data
 * @param {Function} isFirstHomeVisit - Function to check if this is the first home visit
 * @returns {Object} Card dealing state and helper functions
 */
export const useCardDealing = (projects, isFirstHomeVisit) => {
  const [cardOrder, setCardOrder] = useState([]);
  const [isStacked, setIsStacked] = useState(isFirstHomeVisit());
  
  // Generate random rotations and positions for each card in the stack (only on first visit)
  const [stackTransforms] = useState(() => {
    if (isFirstHomeVisit()) {
      // Pre-generate transforms for up to 10 cards
      return Array.from({ length: 10 }, () => ({
        rotation: (Math.random() - 0.5) * 30, // Random rotation between -15° and 15°
        offsetX: (Math.random() - 0.5) * 40,  // Random X offset between -20px and 20px
        offsetY: (Math.random() - 0.5) * 20   // Random Y offset between -10px and 10px
      }));
    }
    return [];
  });

  // Update card order when projects load
  useEffect(() => {
    if (projects.length > 0 && cardOrder.length === 0) {
      if (isFirstHomeVisit()) {
        // Create shuffled indices for first visit
        // The last item in the array (highest z-index) will go to front of carousel (position 0)
        const indices = Array.from({ length: projects.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setCardOrder(indices);
      } else {
        // Normal order on subsequent visits
        setCardOrder(Array.from({ length: projects.length }, (_, i) => i));
      }
    }
  }, [projects, isFirstHomeVisit, cardOrder.length]);

  // Fan out after 2.5 seconds only on first visit
  useEffect(() => {
    if (isFirstHomeVisit()) {
      const timer = setTimeout(() => {
        setIsStacked(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isFirstHomeVisit]);

  // Card positioning constants
  const radiusX = 400; // Horizontal radius
  const radiusZ = 200; // Depth radius
  const totalCards = cardOrder.length;

  /**
   * Get transform styles for a card based on stack/carousel state
   * @param {number} stackIndex - Position in the stack
   * @param {number} carouselIndex - Position in the carousel
   * @param {number} rotation - Current carousel rotation
   * @returns {Object} Style object with transform, opacity, zIndex
   */
  const getCardTransform = (stackIndex, carouselIndex, rotation = 0) => {
    if (isStacked) {
      // Stack cards with random rotation and slight position offsets for disorganized look
      const transform = stackTransforms[stackIndex] || { rotation: 0, offsetX: 0, offsetY: 0 };
      
      return {
        transform: `translate3d(${transform.offsetX}px, ${transform.offsetY}px, ${stackIndex * 2}px) rotate(${transform.rotation}deg)`,
        opacity: 1, // Full opacity in stack
        zIndex: stackIndex // Higher index = on top of stack
      };
    } else {
      // Calculate angle for this card in the oval using carousel position
      const angleStep = 360 / totalCards;
      const angle = (carouselIndex * angleStep + rotation) * Math.PI / 180;
      
      // Calculate oval position
      const x = Math.sin(angle) * radiusX;
      const z = Math.cos(angle) * radiusZ;
      
      // Calculate scale based on z-position (depth)
      const normalizedZ = (z + radiusZ) / (radiusZ * 2); // 0 to 1
      const scale = 0.6 + (normalizedZ * 0.4); // Scale from 0.6 to 1.0
      
      // Very gradual opacity transition - cards stay visible throughout most of rotation
      let opacity;
      if (normalizedZ > 0.4) {
        opacity = 1.0; // Front and most side cards are fully opaque
      } else if (normalizedZ > 0.05) {
        // Much more gradual fade that starts later and extends longer
        opacity = Math.max(0.2, normalizedZ * 1.5); // Slow fade from 0.6 down to 0.2
      } else {
        opacity = 0; // Only completely hidden cards are invisible
      }
      
      // Calculate z-index (closer objects in front)
      const zIndex = Math.round(50 + normalizedZ * 50);
      
      return {
        transform: `translate3d(${x}px, 0, ${z}px) scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex
      };
    }
  };

  /**
   * Get CSS class name for a card based on its position and state
   * @param {number} stackIndex - Position in the stack
   * @param {number} carouselIndex - Position in the carousel
   * @param {number} rotation - Current carousel rotation
   * @returns {string} CSS class names
   */
  const getCardClassName = (stackIndex, carouselIndex, rotation = 0) => {
    let className = 'project-card';
    
    if (isStacked) {
      className += ' active';
    } else {
      const angleStep = 360 / totalCards;
      const angle = (carouselIndex * angleStep + rotation) * Math.PI / 180;
      const z = Math.cos(angle) * radiusZ;
      const normalizedZ = (z + radiusZ) / (radiusZ * 2);
      
      if (normalizedZ > 0.4) {
        className += ' active';
      } else if (normalizedZ > 0.05) {
        className += ' side';
      } else {
        className += ' hidden';
      }
    }
    
    return className;
  };

  /**
   * Get carousel position for a stack index (reverses order so top stack card goes to front)
   * @param {number} stackPosition - Position in the stack
   * @returns {number} Position in the carousel
   */
  const getCarouselPosition = (stackPosition) => {
    return (totalCards - 1 - stackPosition) % totalCards;
  };

  return {
    cardOrder,
    stackTransforms,
    isStacked,
    totalCards,
    getCardTransform,
    getCardClassName,
    getCarouselPosition
  };
};