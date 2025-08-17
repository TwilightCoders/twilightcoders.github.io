import { Link } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';
import { useActiveSection } from '../hooks/useActiveSection';
import './Navigation.scss';

const Navigation = () => {
  const { navigateToPage } = useNavigation();
  const activeSection = useActiveSection();
  
  const handleNavClick = (path, e) => {
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      e.preventDefault(); // Prevent router navigation on mobile
      
      // Scroll to the appropriate page section
      const pageIndex = path === '/' ? 0 : path === '/about' ? 1 : 2;
      const pageElement = document.querySelector(`.page-slide:nth-child(${pageIndex + 1})`);
      
      if (pageElement) {
        pageElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      navigateToPage(path);
    }
  };
  
  return (
    <nav className="navigation">
      <Link to="/" className={`nav-link ${activeSection === '/' ? 'active' : ''}`} onClick={(e) => handleNavClick('/', e)}>Projects</Link>
      <Link to="/about" className={`nav-link ${activeSection === '/about' ? 'active' : ''}`} onClick={(e) => handleNavClick('/about', e)}>About</Link>
      <Link to="/contact" className={`nav-link ${activeSection === '/contact' ? 'active' : ''}`} onClick={(e) => handleNavClick('/contact', e)}>Contact</Link>
    </nav>
  );
};

export default Navigation;