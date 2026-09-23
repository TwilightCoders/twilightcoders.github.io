import { Github, Store } from 'lucide-react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-bottom">
          <div className="footer-links">
            <a href="https://github.com/TwilightCoders" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
              GitHub
            </a>
            <a href="https://twilightcoders.com">
              <Store size={18} />
              Products &amp; contact
            </a>
          </div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Twilight Coders, LLC</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
