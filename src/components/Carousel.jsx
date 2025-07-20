import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useGitHubData } from '../hooks/useGitHubData';
import { useCardDealing } from '../hooks/useCardDealing';
import { getLanguageColor } from '../services/githubApi';
import './Carousel.scss';

const Carousel = () => {
  const { repositories: projects, loading, error } = useGitHubData(6);
  const { isFirstHomeVisit } = useNavigation();
  
  // Card dealing and animation state
  const {
    cardOrder,
    isStacked,
    totalCards,
    getCardTransform,
    getCardClassName,
    getCarouselPosition
  } = useCardDealing(projects, isFirstHomeVisit);

  // Carousel interaction state
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  
  // Refs for drag handling
  const startX = useRef(0);
  const currentX = useRef(0);
  const baseRotation = useRef(0);
  const carouselRef = useRef(null);
  
  // Constants
  const threshold = 50; // Minimum drag distance to trigger navigation

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
    console.log('handleStart called', { isAnimating, isStacked });
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
    
    // Update rotation in real-time during drag for immediate feedback
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
      // Only animate on release, not during drag
      updateCarousel();
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


  // Show loading state
  if (loading) {
    return (
      <div className="carousel-container">
        <div className="carousel-loading">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  // Show error state with fallback
  if (error && projects.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-error">
          <p>Unable to load live projects. Showing examples...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`carousel-container ${isDragging ? 'dragging' : ''}`}>
      <div className="carousel" ref={carouselRef}>
        {cardOrder.map((originalIndex, stackPosition) => {
          const project = projects[originalIndex];
          if (!project) return null;
          
          // Get carousel position (reverses order so top stack card goes to front)
          const carouselPosition = getCarouselPosition(stackPosition);
          
          // Get styles and class names from the hook
          const cardStyle = getCardTransform(stackPosition, carouselPosition, rotation);
          const cardClassName = getCardClassName(stackPosition, carouselPosition, rotation);
          
          return (
            <div
              key={project.id}
              className="card-wrapper"
              style={cardStyle}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => handleCardClick(e, carouselPosition)}
            >
              <div className={cardClassName}>
              <div className="reflection"></div>
              <div className="card-top-row">
                {project.language && (
                  <div 
                    className="language-badge"
                    style={{ borderColor: getLanguageColor(project.language) }}
                  >
                    <span 
                      className="language-dot" 
                      style={{ backgroundColor: getLanguageColor(project.language) }}
                    ></span>
                    {project.language}
                  </div>
                )}
                {project.stars !== undefined && (
                  <div className="stars-badge">
                    <span>⭐</span>
                    <span>{project.stars}</span>
                  </div>
                )}
              </div>
              <div className="project-header">
                <h3>{project.displayName || project.name}</h3>
              </div>
              <p>{project.displayDescription}</p>
              <div className="project-footer">
                <a 
                  href={project.url} 
                  className="project-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.homepage ? 'Visit Site' : 'View Code'}
                </a>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;