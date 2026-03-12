import { useState, useEffect, useRef, useCallback } from 'react';
import { useGitHubData } from '../hooks/useGitHubData';
import ProjectCard from './ProjectCard';
import './Carousel.scss';

const Carousel = () => {
  const { repositories: projects, loading, error } = useGitHubData();
  const [step, setStep] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const latestDx = useRef(0);
  const sceneRef = useRef(null);

  const fallbackProjects = [
    { id: 1, name: 'Test Project 1', description: 'A sample project for testing', html_url: '#', language: 'JavaScript', stargazers_count: 42, forks_count: 12 },
    { id: 2, name: 'Test Project 2', description: 'Another sample project', html_url: '#', language: 'TypeScript', stargazers_count: 23, forks_count: 5 },
    { id: 3, name: 'Test Project 3', description: 'Yet another test project', html_url: '#', language: 'Python', stargazers_count: 156, forks_count: 34 },
    { id: 4, name: 'Test Project 4', description: 'Fourth test project', html_url: '#', language: 'React', stargazers_count: 89, forks_count: 21 },
    { id: 5, name: 'Test Project 5', description: 'Fifth test project', html_url: '#', language: 'Vue', stargazers_count: 67, forks_count: 15 },
    { id: 6, name: 'Test Project 6', description: 'Sixth test project', html_url: '#', language: 'Angular', stargazers_count: 34, forks_count: 8 }
  ];

  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;
  const count = displayProjects.length;
  const theta = 360 / count;
  const minRadius = Math.round(280 / (2 * Math.tan(Math.PI / count)));
  const radius = minRadius + 60;

  const currentIndex = ((step % count) + count) % count;

  const goToIndex = useCallback((targetIdx) => {
    setStep((prev) => {
      const cur = ((prev % count) + count) % count;
      let diff = targetIdx - cur;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      return prev + diff;
    });
  }, [count]);

  // --- Drag via pointer down on scene, global move/up ---
  const onPointerDown = (e) => {
    if (e.target.closest('a, button')) return;
    e.preventDefault();
    dragging.current = true;
    latestDx.current = 0;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDragPx(0);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const dx = x - startX.current;
      latestDx.current = dx;
      setDragPx(dx);
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const dx = latestDx.current;
      setDragPx(0);

      // 120px of drag = one card step
      const steps = Math.round(dx / 120);
      if (steps !== 0) {
        setStep((s) => s - steps);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setStep((s) => s - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setStep((s) => s + 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-rotate
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (!dragging.current) setStep((s) => s + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  if (loading) {
    return (
      <div className="carousel-container">
        <div className="carousel-loading">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    console.log('Error loading projects, using fallback:', error);
  }

  // Map drag pixels to degrees for live feedback
  const dragDeg = (dragPx / 120) * theta;
  const rotAngle = -step * theta + dragDeg;
  const isDragging = dragPx !== 0;

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="carousel-scene"
        ref={sceneRef}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        <div
          className="carousel"
          style={{
            transform: `translateZ(${-radius}px) rotateY(${rotAngle}deg)`,
            transition: isDragging ? 'none' : undefined
          }}
        >
          {displayProjects.map((project, index) => {
            const rawDiff = ((index * theta + rotAngle) % 360 + 360) % 360;
            const angleDiff = rawDiff > 180 ? 360 - rawDiff : rawDiff;
            const isFront = angleDiff < theta * 0.6;

            return (
              <div
                key={project.id || index}
                className={`carousel-cell ${isFront ? 'carousel-cell--front' : ''}`}
                style={{
                  transform: `rotateY(${index * theta}deg) translateZ(${radius}px)`
                }}
              >
                <ProjectCard project={project} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-dots">
        {displayProjects.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
