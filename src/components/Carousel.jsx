import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useGitHubData } from '../hooks/useGitHubData';
import { getLanguageColor } from '../services/githubApi';
import { Github, ExternalLink } from 'lucide-react';
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
  const mobileScrollRef = useRef(null);
  
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
  const baseProjects = shuffledProjects.length > 0 ? shuffledProjects : projects;
  
  // Create infinite scroll by duplicating projects array
  // Structure: [projects, projects, projects] for seamless infinite scroll
  const displayProjects = baseProjects.length > 0 ? [
    ...baseProjects.map((project, index) => ({ ...project, id: `prev-${project.id}-${index}` })),
    ...baseProjects.map((project, index) => ({ ...project, id: `current-${project.id}-${index}` })),
    ...baseProjects.map((project, index) => ({ ...project, id: `next-${project.id}-${index}` }))
  ] : [];

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
  const radiusX = 550; // Horizontal radius - balanced spacing for desktop
  const radiusZ = 300; // Depth radius - balanced depth effect
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
    // If user dragged, don't handle click
    if (hasDragged) {
      return;
    }
    
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

  // Mobile scroll initialization and hint animation
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && mobileScrollRef.current) {
      const scrollContainer = mobileScrollRef.current;
      let userHasScrolled = false;
      let isInitializing = true;
      
      // IMMEDIATELY set initial position to avoid "whisking" effect
      const cardWidth = window.innerWidth;
      const totalCards = baseProjects.length;
      const middleSectionStart = totalCards * cardWidth; // Start of middle section
      
      
      // Only set position if we have valid data
      if (totalCards > 0) {
        // Temporarily disable scroll-snap for initial positioning
        const originalScrollSnapType = scrollContainer.style.scrollSnapType;
        scrollContainer.style.scrollSnapType = 'none';
        
        scrollContainer.scrollLeft = middleSectionStart;
        
        // Re-enable scroll-snap after a tiny delay
        setTimeout(() => {
          scrollContainer.style.scrollSnapType = originalScrollSnapType || 'x mandatory';
        }, 50);
      } else {
      }
      
      // Enhanced force to exact position with device-specific handling
      const forceExactPosition = () => {
        const cardWidth = window.innerWidth;
        const currentScroll = scrollContainer.scrollLeft;
        const nearestCard = Math.round(currentScroll / cardWidth);
        const exactPosition = nearestCard * cardWidth;
        
        
        // For real devices, sometimes we need to account for scroll-padding
        if (Math.abs(currentScroll - exactPosition) > 1) {
          scrollContainer.scrollLeft = exactPosition;
          
          // Additional check for real device padding issues
          setTimeout(() => {
            const finalScroll = scrollContainer.scrollLeft;
            if (Math.abs(finalScroll - exactPosition) > 1) {
              // Try alternative positioning that accounts for iOS Safari quirks
              scrollContainer.scrollLeft = exactPosition;
            }
          }, 100);
        }
      };
      
      // Clean up positioning after initial set - but don't move the scroll position again
      const initialTimer = setTimeout(() => {
        if (scrollContainer) {
          
          // Force exact positioning after a moment
          setTimeout(() => {
            forceExactPosition();
            // Initialization complete, now track user interactions
            setTimeout(() => {
              isInitializing = false;
            }, 500); // Longer delay to ensure everything is settled
          }, 100);
        }
      }, 300);
      
      // Listen for scroll events and track user interaction
      let isScrolling = false;
      let scrollEndTimer = null;
      
      const handleScrollStart = () => {
        isScrolling = true;
        userHasScrolled = true; // Mark that user has interacted
      };
      
      const handleScrollEnd = () => {
        if (isScrolling) {
          setTimeout(() => {
            forceExactPosition();
            isScrolling = false;
            
            // Check for infinite scroll jump after scroll ends
            checkAndPerformInfiniteJump();
          }, 100);
        }
      };
      
      // Separate function to handle infinite scroll jumps
      const checkAndPerformInfiniteJump = () => {
        const cardWidth = window.innerWidth;
        const totalCards = baseProjects.length;
        const currentScroll = scrollContainer.scrollLeft;
        const currentCardIndex = Math.round(currentScroll / cardWidth);
        
        
        // Only jump if we're actually at the problematic boundaries
        // Be more conservative to avoid unnecessary jumps
        if (currentCardIndex <= 1) {
          // Jump from first card to equivalent position in middle section
          const equivalentIndex = currentCardIndex + totalCards;
          const targetScroll = equivalentIndex * cardWidth;
          performSneakyJump(targetScroll, 'start to middle');
        } else if (currentCardIndex >= (totalCards * 3) - 2) {
          // Jump from last card to equivalent position in middle section
          const equivalentIndex = currentCardIndex - totalCards;
          const targetScroll = equivalentIndex * cardWidth;
          performSneakyJump(targetScroll, 'end to middle');
        } else {
        }
      };
      
      // Ultra-sneaky jump function
      const performSneakyJump = (targetScroll, description) => {
        
        // Don't remove scroll listener - just set a flag to ignore scroll events temporarily
        let isJumping = true;
        
        // Temporarily modify the scroll handler
        const originalHandleScroll = handleScroll;
        const tempHandleScroll = () => {
          if (!isJumping) {
            originalHandleScroll();
          } else {
          }
        };
        
        // Replace the scroll handler temporarily
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.addEventListener('scroll', tempHandleScroll);
        
        // Set instant behavior and jump
        const originalBehavior = scrollContainer.style.scrollBehavior;
        scrollContainer.style.scrollBehavior = 'auto';
        scrollContainer.scrollLeft = targetScroll;
        
        
        // Restore everything after a tiny delay
        setTimeout(() => {
          isJumping = false;
          scrollContainer.style.scrollBehavior = originalBehavior || 'smooth';
          scrollContainer.removeEventListener('scroll', tempHandleScroll);
          scrollContainer.addEventListener('scroll', handleScroll);
        }, 50); // Slightly longer delay
      };
      
      // Track scroll for infinite scroll behavior and user interaction
      const handleScroll = () => {
        // Only mark as user scrolled if we're not initializing
        if (!isInitializing) {
          userHasScrolled = true;
        } else {
        }
      };
      
      scrollContainer.addEventListener('touchstart', handleScrollStart);
      scrollContainer.addEventListener('touchend', handleScrollEnd);
      scrollContainer.addEventListener('mousedown', handleScrollStart);
      scrollContainer.addEventListener('mouseup', handleScrollEnd);
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // Scroll hint animation - show more of the next card
      if (displayProjects.length > 1) {
        
        const hintTimer = setTimeout(() => {
          
          if (scrollContainer && !userHasScrolled) {
            // Natural, smooth scroll hint animation
            const originalScrollSnapType = scrollContainer.style.scrollSnapType;
            const originalBehavior = scrollContainer.style.scrollBehavior;
            
            // Temporarily disable scroll-snap but keep smooth behavior
            scrollContainer.style.scrollSnapType = 'none';
            scrollContainer.style.scrollBehavior = 'smooth';
            
            const cardWidth = window.innerWidth;
            const hintDistance = cardWidth * 0.25; // Show 25% of next card
            const currentPosition = scrollContainer.scrollLeft;
            const targetHintPosition = currentPosition + hintDistance;
            
            
            // Smooth scroll to hint position FROM CURRENT POSITION
            scrollContainer.scrollTo({
              left: targetHintPosition,
              behavior: 'smooth'
            });
            
            // Wait longer to let user appreciate the peek
            setTimeout(() => {
              // Smooth scroll back to where we started
              scrollContainer.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
              });
              
              // Re-enable scroll-snap after the return animation completes
              setTimeout(() => {
                scrollContainer.style.scrollSnapType = originalScrollSnapType || 'x mandatory';
                scrollContainer.style.scrollBehavior = originalBehavior || 'smooth';
                
                // Force exact positioning to fix edge spacing after hint
                setTimeout(() => {
                  forceExactPosition();
                  
                  // Double-check positioning after a moment
                  setTimeout(() => {
                    const currentScroll = scrollContainer.scrollLeft;
                    const cardWidth = window.innerWidth;
                    const nearestCard = Math.round(currentScroll / cardWidth);
                    const exactPosition = nearestCard * cardWidth;
                    
                    
                    if (Math.abs(currentScroll - exactPosition) > 5) {
                      scrollContainer.scrollLeft = exactPosition;
                    }
                  }, 200);
                }, 100);
              }, 400); // Wait for smooth return to complete
            }, 1500); // Longer pause to let user see the hint
          }
        }, 3000); // Slightly longer delay
        
        return () => {
          clearTimeout(initialTimer);
          clearTimeout(hintTimer);
          scrollContainer.removeEventListener('touchstart', handleScrollStart);
          scrollContainer.removeEventListener('touchend', handleScrollEnd);
          scrollContainer.removeEventListener('mousedown', handleScrollStart);
          scrollContainer.removeEventListener('mouseup', handleScrollEnd);
          scrollContainer.removeEventListener('scroll', handleScroll);
        };
      }
      
      return () => {
        clearTimeout(initialTimer);
        scrollContainer.removeEventListener('touchstart', handleScrollStart);
        scrollContainer.removeEventListener('touchend', handleScrollEnd);
        scrollContainer.removeEventListener('mousedown', handleScrollStart);
        scrollContainer.removeEventListener('mouseup', handleScrollEnd);
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [displayProjects.length, baseProjects.length]);

  const getCardTransform = (index) => {
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isStacked) {
      // Stack cards with random rotation and slight position offsets for disorganized look
      const transform = stackTransforms[index] || { rotation: 0, offsetX: 0, offsetY: 0 };
      
      return {
        transform: `translate3d(${transform.offsetX}px, ${transform.offsetY}px, ${index * 2}px) rotate(${transform.rotation}deg)`,
        opacity: 1, // Full opacity in stack
        zIndex: index // Higher index = on top of stack
      };
    } else if (isMobile) {
      // Mobile layout - use flat positioning like desktop but with mobile spacing
      const angleStep = 360 / totalCards;
      const angle = (index * angleStep + rotation) * Math.PI / 180;
      
      // Use smaller radius for mobile
      const mobileRadiusX = 180;
      const x = Math.sin(angle) * mobileRadiusX;
      
      // Simple depth calculation for mobile
      const z = Math.cos(angle) * 100;
      const normalizedZ = (z + 100) / 200; // 0 to 1
      const scale = 0.7 + (normalizedZ * 0.3); // Scale from 0.7 to 1.0
      const opacity = 0.4 + (normalizedZ * 0.6); // Opacity from 0.4 to 1.0
      
      // Z-index for proper layering
      const zIndex = Math.round(50 + normalizedZ * 50);
      
      return {
        transform: `translateX(${x}px) scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex,
        display: normalizedZ > 0.3 ? 'flex' : 'none' // Show more cards
      };
    } else {
      // Desktop oval layout
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

  // Check if mobile for rendering logic
  const isMobile = window.innerWidth <= 768;

  return (
    <div className={`carousel-container ${isDragging ? 'dragging' : ''}`}>
      {isMobile ? (
        // Mobile: Horizontal snap scroll layout
        <div className="mobile-carousel-scroll" ref={mobileScrollRef}>
          {displayProjects.map((project) => (
            <div
              key={project.id}
              className="mobile-project-card"
            >
              <div className="mobile-project-card-inner">
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
                  >
                    {project.homepage ? (
                      <>
                        <ExternalLink size={16} />
                        Visit Site
                      </>
                    ) : (
                      <>
                        <Github size={16} />
                        View Code
                      </>
                    )}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop: 3D carousel
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
                        <ExternalLink size={16} />
                        Visit Site
                      </>
                    ) : (
                      <>
                        <Github size={16} />
                        View Code
                      </>
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Carousel;
