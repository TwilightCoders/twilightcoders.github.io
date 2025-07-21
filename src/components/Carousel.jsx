import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useGitHubData } from '../hooks/useGitHubData';
import { getLanguageColor } from '../services/githubApi';
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
  const { repositories: projects, loading, error } = useGitHubData(6);
  const { isFirstHomeVisit } = useNavigation();
  
  // Generate random rotations and positions for each card in the stack (only on first visit)
  // CRITICAL: These transforms must be completely stable and never change after initialization
  // to prevent CSS transform coordinate system issues that break button click detection.
  // We achieve randomization by shuffling the projects array below, not by changing these transforms.
  const [stackTransforms] = useState(() => {
    if (isFirstHomeVisit()) {
      // Pre-generate transforms for up to 10 cards (will work even if fewer projects load)
      return Array.from({ length: 10 }, () => ({
        rotation: (Math.random() - 0.5) * 30, // Random rotation between -15° and 15°
        offsetX: (Math.random() - 0.5) * 40,  // Random X offset between -20px and 20px
        offsetY: (Math.random() - 0.5) * 20   // Random Y offset between -10px and 10px
      }));
    }
    return [];
  });

  // Shuffle projects array on first visit for random dealing order
  // This approach maintains transform stability while achieving perfect randomization
  // by transforming the data rather than the transforms themselves.
  const [shuffledProjects, setShuffledProjects] = useState([]);
  
  useEffect(() => {
    if (projects.length > 0 && shuffledProjects.length === 0) {
      if (isFirstHomeVisit()) {
        // Shuffle the projects array for random dealing
        const shuffled = [...projects];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledProjects(shuffled);
      } else {
        // Keep original order on subsequent visits
        setShuffledProjects([...projects]);
      }
    }
  }, [projects, shuffledProjects.length, isFirstHomeVisit]);

  // Use shuffled projects for rendering
  const displayProjects = shuffledProjects.length > 0 ? shuffledProjects : projects;

  // Pick a random card to center on first visit only
  const [rotation, setRotation] = useState(() => {
    if (isFirstHomeVisit()) {
      const randomCardIndex = Math.floor(Math.random() * 6); // Assume up to 6 projects
      const angleStep = 360 / 6;
      return -randomCardIndex * angleStep;
    } else {
      // Return to first card on subsequent visits
      return 0;
    }
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isStacked, setIsStacked] = useState(isFirstHomeVisit()); // Only stack on first visit
  const [isDealing, setIsDealing] = useState(isFirstHomeVisit()); // Track dealing animation
  const [hasDragged, setHasDragged] = useState(false);
  
  const startX = useRef(0);
  const currentX = useRef(0);
  const baseRotation = useRef(0);
  const carouselRef = useRef(null);
  
  const totalCards = displayProjects.length;
  const radiusX = 450; // Horizontal radius - increased for better spacing
  const radiusZ = 250; // Depth radius - increased for more depth effect
  const threshold = 50; // Minimum drag distance to trigger navigation

  // Fan out after 1.5 seconds only on first visit
  useEffect(() => {
    if (isFirstHomeVisit()) {
      const timer = setTimeout(() => {
        setIsStacked(false);
        // End dealing animation after the cards have spread out
        setTimeout(() => {
          setIsDealing(false);
        }, 1200); // Wait for dealing transition to complete
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
      // Stack cards with random rotation and slight position offsets for disorganized look
      const transform = stackTransforms[index] || { rotation: 0, offsetX: 0, offsetY: 0 };
      
      return {
        transform: `translate3d(${transform.offsetX}px, ${transform.offsetY}px, ${index * 2}px) rotate(${transform.rotation}deg)`,
        opacity: 1, // Full opacity in stack
        zIndex: index // Higher index = on top of stack
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
    
    // Add dealing class during the initial animation
    if (isDealing) {
      className += ' dealing';
    }
    
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
  if (error && displayProjects.length === 0) {
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
        {displayProjects.map((project, index) => {
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
                  {project.homepage ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className="external-icon">
                        <path d="M283.276,454.904c-4.739,3.858-9.502,6.888-14.295,9.177c-3.256,0.348-6.533,0.603-9.827,0.796v-38.201c-7.878-6.448-15.802-13.144-23.751-20.024v58.232c-3.293-0.2-6.571-0.456-9.818-0.804c-4.794-2.289-9.564-5.32-14.303-9.177c-15.447-12.572-29.905-33.794-40.992-61.108h50.486c-8.605-7.693-17.218-15.618-25.83-23.75h-32.959c-3.936-13.09-7.104-27.207-9.517-42.013c-9.378-9.703-18.486-19.429-27.331-29.139c1.987,25.281,6.061,49.264,12.13,71.152H76.602c-16.986-27.454-27.516-59.276-29.511-93.464h58.24c-6.881-7.948-13.577-15.873-20.017-23.751H47.092c0.819-14.009,3.147-27.586,6.68-40.66c-8.064-11.001-15.626-21.84-22.599-32.456c-10.368,26.333-16.127,54.986-16.127,84.999c0.007,128.262,103.963,232.21,232.226,232.218c30.005,0,58.658-5.759,84.982-16.119c-14.14-9.301-28.691-19.638-43.488-30.84C286.948,451.726,285.124,453.397,283.276,454.904z M105.456,406.53c-4.067-4.067-7.933-8.335-11.636-12.734h51.158c3.811,10.391,8.002,20.287,12.694,29.379c5.528,10.685,11.652,20.403,18.339,29.016C149.307,442.039,125.325,426.384,105.456,406.53z"/>
                        <path d="M78.442,105.348c5.072,9.084,10.839,18.548,17.187,28.296c3.17-3.68,6.386-7.314,9.826-10.754c19.908-19.893,43.945-35.58,70.71-45.731c-12.44,15.973-22.9,35.788-31.226,58.457H96.89c5.086,7.746,10.568,15.679,16.374,23.75h24.068c-2.188,7.878-4.067,16.074-5.76,24.454c6.363,8.18,13.02,16.452,19.947,24.787c2.498-17.458,6.007-34.042,10.585-49.242h73.3v93.464h-45.12c7.338,7.94,14.852,15.865,22.545,23.751h22.575v22.576c7.886,7.685,15.811,15.215,23.751,22.544v-45.12h87.751c-0.974,34.095-6.146,65.918-14.442,93.464h-17.388c11.412,9.192,22.676,17.844,33.694,25.876c0.271-0.727,0.587-1.392,0.858-2.126h51.112c-3.711,4.399-7.569,8.667-11.636,12.734c-3.433,3.432-7.036,6.695-10.716,9.864c9.734,6.34,19.181,12.092,28.243,17.164c44.849-42.336,72.883-102.301,72.883-168.844C479.505,136.451,375.542,32.488,247.272,32.48C180.728,32.488,120.779,60.514,78.442,105.348z M417.956,370.046h-60.73c7.84-28.259,12.587-59.88,13.507-93.464h76.734C445.472,310.77,434.942,342.591,417.956,370.046z M417.94,159.366c16.994,27.454,27.524,59.284,29.526,93.464h-76.811c-0.928-33.554-5.535-65.222-13.375-93.464H417.94z M389.094,122.89c4.067,4.067,7.925,8.327,11.628,12.726H349.58c-3.811-10.383-8.01-20.279-12.695-29.371c-5.528-10.677-11.651-20.395-18.331-29.016C345.25,87.38,369.226,103.044,389.094,122.89z M259.154,64.534c3.301,0.201,6.58,0.456,9.834,0.804c4.794,2.281,9.548,5.312,14.288,9.169c15.447,12.564,29.897,33.794,40.984,61.108h-65.106V64.534z M259.154,159.366h73.409c8.296,27.539,13.437,59.4,14.419,93.464h-87.828V159.366z M211.282,74.507c4.739-3.858,9.494-6.888,14.288-9.177c3.254-0.348,6.533-0.603,9.833-0.804v71.09h-64.982c2.621-6.472,5.374-12.718,8.35-18.47C188.312,98.652,199.538,84.102,211.282,74.507z"/>
                      </svg>
                      Visit Site
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="github-icon">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View Code
                    </>
                  )}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;