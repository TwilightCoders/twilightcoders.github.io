import { Link } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';
import './Navigation.scss';

const Navigation = () => {
  const { navigateToPage } = useNavigation();
  
  const handleNavClick = (path) => {
    navigateToPage(path);
  };
  
  return (
    <nav className="navigation">
      <Link to="/" className="nav-link" onClick={() => handleNavClick('/')}>Projects</Link>
      <Link to="/about" className="nav-link" onClick={() => handleNavClick('/about')}>About</Link>
      <Link to="/contact" className="nav-link" onClick={() => handleNavClick('/contact')}>Contact</Link>
    </nav>
  );
};

export default Navigation;