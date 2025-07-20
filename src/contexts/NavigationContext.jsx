import { createContext, useContext, useState, useRef } from 'react';

const NavigationContext = createContext();

// Define page order and positions
const PAGE_ORDER = {
  '/': 0,
  '/about': 1,
  '/contact': 2
};

export const NavigationProvider = ({ children }) => {
  const [direction, setDirection] = useState(0);
  const previousPath = useRef('/');
  const hasVisitedHome = useRef(false); // Track if we've ever visited home
  
  const navigateToPage = (newPath) => {
    const currentIndex = PAGE_ORDER[previousPath.current] || 0;
    const newIndex = PAGE_ORDER[newPath] || 0;
    const calculatedDirection = newIndex - currentIndex;
    
    console.log(`Navigating from ${previousPath.current} (${currentIndex}) to ${newPath} (${newIndex}), direction: ${calculatedDirection}`);
    
    setDirection(calculatedDirection);
    previousPath.current = newPath;
    
    // Mark home as visited when we navigate to it
    if (newPath === '/') {
      hasVisitedHome.current = true;
    }
  };
  
  const isFirstHomeVisit = () => {
    return !hasVisitedHome.current;
  };
  
  return (
    <NavigationContext.Provider value={{ direction, navigateToPage, isFirstHomeVisit }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};