import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import './Carousel.scss';

// Placeholder project data - we'll replace this with GitHub API data later
const PLACEHOLDER_PROJECTS = [
  {
    id: 0,
    name: "Project #1",
    description: "A revolutionary approach to solving complex problems with elegant solutions that push the boundaries of what's possible.",
    url: "#"
  },
  {
    id: 1,
    name: "Project #2", 
    description: "Cutting-edge technology meets practical application in this innovative tool designed for modern workflows.",
    url: "#"
  },
  {
    id: 2,
    name: "Project #3",
    description: "Open-source contribution to the developer community with modern best practices and clean architecture.",
    url: "#"
  },
  {
    id: 3,
    name: "Project #4",
    description: "Advanced analytics platform that transforms raw data into actionable insights for businesses of all sizes.",
    url: "#"
  },
  {
    id: 4,
    name: "Project #5",
    description: "AI-powered automation suite that streamlines repetitive tasks and enhances productivity across teams.",
    url: "#"
  },
  {
    id: 5,
    name: "Project #6",
    description: "Advanced analytics platform that transforms raw data into actionable insights for businesses of all sizes.",
    url: "#"
  },
  {
    id: 6,
    name: "Project #7",
    description: "AI-powered automation suite that streamlines repetitive tasks and enhances productivity across teams.",
    url: "#"
  }
];

const Carousel = () => {
  const [projects] = useState(PLACEHOLDER_PROJECTS);
  const { isFirstHomeVisit } = useNavigation();
  
  // Pick a random card to center on first visit only
  const [rotation, setRotation] = useState(() => {
    if (isFirstHomeVisit()) {
      const randomCardIndex = Math.floor(Math.random() * PLACEHOLDER_PROJECTS.length);
      const angleStep = 360 / PLACEHOLDER_PROJECTS.length;
      return -randomCardIndex * angleStep;
    } else {
      // Return to first card on subsequent visits
      return 0;
    }
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isStacked, setIsStacked] = useState(isFirstHomeVisit()); // Only stack on first visit
  const [hasDragged, setHasDragged] = useState(false);
  
  const startX = useRef(0);
  const currentX = useRef(0);
  const baseRotation = useRef(0);
  const carouselRef = useRef(null);
  
  const totalCards = projects.length;
  const radiusX = 450; // Horizontal radius - increased for better spacing
  const radiusZ = 250; // Depth radius - increased for more depth effect
  const threshold = 50; // Minimum drag distance to trigger navigation

  // Fan out after 1.5 seconds only on first visit
  useEffect(() => {
    if (isFirstHomeVisit()) {
      const timer = setTimeout(() => {
        setIsStacked(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isFirstHomeVisit]);

  const updateCarousel = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    const angleStep = 360 / totalCards;
    setRotation(-index * angleStep);
    updateCarousel();
  };

  const handleStart = (e) => {
    if (isAnimating) return;
    
    // Prevent default behavior to avoid text selection
    e.preventDefault();
    
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startX.current = clientX;
    currentX.current = clientX;
    baseRotation.current = rotation;
    setHasDragged(false);
    setIsDragging(false);
  };

  const handleMove = (e) => {
    // Only process if we actually started a drag on a card
    if (startX.current === 0) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    currentX.current = clientX;
    
    const deltaX = currentX.current - startX.current;
    
    // Start dragging immediately on any movement for maximum responsiveness
    if (!isDragging && Math.abs(deltaX) > 0) {
      setIsDragging(true);
      setHasDragged(true);
    }
    
    // Always update rotation during any movement, regardless of isDragging state
    // This prevents interruption issues with async state updates
    if (Math.abs(deltaX) > 0) {
      e.preventDefault();
      const rotationDelta = (deltaX / window.innerWidth) * 360; // Full rotation across screen width
      const newRotation = baseRotation.current + rotationDelta;
      setRotation(newRotation);
    }
  };

  const handleEnd = (e) => {
    // Only process if we actually started a drag on a card
    if (startX.current === 0) return;
    
    if (isDragging) {
      setIsDragging(false);
      
      const deltaX = currentX.current - startX.current;
      const rotationDelta = (deltaX / window.innerWidth) * 360;
      
      // Update rotation based on drag
      let newRotation = baseRotation.current + rotationDelta;
      
      // Optionally snap to show cards clearly
      if (Math.abs(deltaX) > threshold) {
        const snapAngle = 360 / totalCards;
        const snapTarget = Math.round(newRotation / snapAngle) * snapAngle;
        newRotation = snapTarget;
      }
      
      setRotation(newRotation);
      // Don't call updateCarousel() - let rotation be immediate without animation
    }
    
    // Reset all drag tracking
    startX.current = 0;
    currentX.current = 0;
    
    // Reset drag tracking after a small delay to prevent immediate clicks
    setTimeout(() => {
      setHasDragged(false);
    }, 100);
  };

  const handleCardClick = (e, index) => {
    // Only handle clicks if we haven't dragged and not stacked
    if (hasDragged || isStacked || isAnimating) {
      return;
    }
    
    // Prevent default link behavior for now
    e.preventDefault();
    e.stopPropagation();
    
    // Simply bring any clicked card to center
    goToSlide(index);
  };

  const handleKeyboard = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setRotation(prev => prev + 360 / totalCards);
      updateCarousel();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setRotation(prev => prev - 360 / totalCards);
      updateCarousel();
    }
  };

  // Add keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  // Add global mouse/touch listeners
  useEffect(() => {
    const handleGlobalMove = (e) => handleMove(e);
    const handleGlobalEnd = (e) => handleEnd(e);
    
    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchmove', handleGlobalMove, { passive: false });
    document.addEventListener('touchend', handleGlobalEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, rotation]);

  const getCardTransform = (index) => {
    if (isStacked) {
      // Stack all cards on top of each other in center
      return {
        transform: `translate3d(0px, 0, ${index * 2}px) scale(1)`,
        opacity: index === totalCards - 1 ? 1 : 0.8,
        zIndex: index
      };
    } else {
      // Calculate angle for this card in the oval
      const angleStep = 360 / totalCards;
      const angle = (index * angleStep + rotation) * Math.PI / 180;
      
      // Calculate oval position
      const x = Math.sin(angle) * radiusX;
      const z = Math.cos(angle) * radiusZ;
      
      // Calculate scale based on z-position (depth)
      const normalizedZ = (z + radiusZ) / (radiusZ * 2); // 0 to 1
      const scale = 0.6 + (normalizedZ * 0.4); // Scale from 0.6 to 1.0
      const opacity = 0.3 + (normalizedZ * 0.7); // Opacity from 0.3 to 1.0 - wider range
      
      // Calculate z-index (closer objects in front)
      const zIndex = Math.round(50 + normalizedZ * 50);
      
      return {
        transform: `translate3d(${x}px, 0, ${z}px) scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex,
        display: normalizedZ > 0.2 ? 'flex' : 'none' // Show more cards by lowering threshold
      };
    }
  };

  const getCardClassName = (index) => {
    let className = 'project-card';
    
    if (isStacked) {
      className += ' active';
    } else {
      const angleStep = 360 / totalCards;
      const angle = (index * angleStep + rotation) * Math.PI / 180;
      const z = Math.cos(angle) * radiusZ;
      const normalizedZ = (z + radiusZ) / (radiusZ * 2);
      
      if (normalizedZ > 0.7) {
        className += ' active';
      } else if (normalizedZ > 0.3) {
        className += ' side';
      } else {
        className += ' hidden';
      }
    }
    
    return className;
  };

  return (
    <div className={`carousel-container ${isDragging ? 'dragging' : ''}`}>
      <div className="carousel" ref={carouselRef}>
        {projects.map((project, index) => {
          const cardStyle = getCardTransform(index);
          const cardClassName = getCardClassName(index);
          
          return (
            <div
              key={project.id}
              className={cardClassName}
              style={cardStyle}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => handleCardClick(e, index)}
            >
              <div className="reflection"></div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <a href={project.url} className="project-link">Learn More</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;