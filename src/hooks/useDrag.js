import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Reusable drag hook for implementing drag interactions
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Minimum drag distance to trigger action (default: 100)
 * @param {Function} options.onDragEnd - Callback when drag ends with direction (-1, 0, 1)
 * @returns {Object} Drag state and handlers
 */
export const useDrag = ({ threshold = 100, onDragEnd } = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleDragStart = useCallback((clientX, clientY = 0) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleDragMove = useCallback((clientX, clientY = 0) => {
    if (!isDragging) return;
    
    const diffX = clientX - dragStart.x;
    const diffY = clientY - dragStart.y;
    setDragOffset({ x: diffX, y: diffY });
  }, [isDragging, dragStart.x, dragStart.y]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine direction based on horizontal drag
    const direction = dragOffset.x > threshold ? -1 : dragOffset.x < -threshold ? 1 : 0;
    
    if (onDragEnd) {
      onDragEnd(direction, dragOffset);
    }
    
    setDragOffset({ x: 0, y: 0 });
  }, [isDragging, dragOffset, threshold, onDragEnd]);

  // Mouse event handlers
  const mouseHandlers = {
    onMouseDown: (e) => {
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY);
    }
  };

  // Touch event handlers
  const touchHandlers = {
    onTouchStart: (e) => {
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    }
  };

  // Global event listeners for drag continuation
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleDragEnd();
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => handleDragEnd();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return {
    isDragging,
    dragOffset,
    containerRef,
    mouseHandlers,
    touchHandlers,
    // Helper to calculate drag percentage relative to container width
    getDragPercentage: () => {
      if (!containerRef.current) return 0;
      return (dragOffset.x / containerRef.current.offsetWidth) * 100;
    }
  };
};