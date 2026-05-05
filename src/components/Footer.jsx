import { Github, Mail } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <NewsletterSignup />
        </div>

        <div className="footer-bottom">
          <div className="footer-links">
            <a href="https://github.com/TwilightCoders" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
              GitHub
            </a>
            <a href="mailto:hello@twilightcoders.dev">
              <Mail size={18} />
              Email
            </a>
          </div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Twilight Coders, LLC</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
