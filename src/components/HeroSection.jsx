import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';
import './HeroSection.scss';

const NAV_ITEMS = [
  { id: 'products', label: 'Products' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'about', label: 'About' },
];

// Tight spring — responsive but smooths out scroll jitter
const SPRING = { stiffness: 300, damping: 30, mass: 0.5 };

const HeroSection = () => {
  const activeSection = useActiveSection();
  const { scrollY } = useScroll();
  const [collapsed, setCollapsed] = useState(false);

  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 1000);
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Hero collapses 3x faster than scroll — reaches 70px in ~1/3 viewport scroll
  const collapseEnd = (vh - 70) / 3;

  // Raw scroll-linked values
  const rawHeight = useTransform(scrollY, [0, collapseEnd], [vh, 70]);
  const rawContentOpacity = useTransform(scrollY, [0, collapseEnd * 0.45], [1, 0]);
  const rawContentScale = useTransform(scrollY, [0, collapseEnd * 0.5], [1, 0.92]);
  const rawNavOpacity = useTransform(scrollY, [collapseEnd * 0.35, collapseEnd * 0.75], [0, 1]);
  const rawBackdropOpacity = useTransform(scrollY, [collapseEnd * 0.25, collapseEnd * 0.65], [0, 1]);

  // Smooth everything through springs
  const height = useSpring(rawHeight, SPRING);
  const contentOpacity = useSpring(rawContentOpacity, SPRING);
  const contentScale = useSpring(rawContentScale, SPRING);
  const navOpacity = useSpring(rawNavOpacity, SPRING);
  const backdropOpacity = useSpring(rawBackdropOpacity, SPRING);

  useMotionValueEvent(scrollY, 'change', (v) => {
    setCollapsed(v > collapseEnd * 0.5);
  });

  const handleNavClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header className="hero-header" style={{ height }}>
        <motion.div className="hero-backdrop" style={{ opacity: backdropOpacity }} />

        <motion.div
          className="hero-navbar"
          style={{
            opacity: navOpacity,
            pointerEvents: collapsed ? 'auto' : 'none',
          }}
        >
          <a href="#" className="nav-brand" onClick={scrollToTop}>
            TWILIGHT CODERS
          </a>
          <nav className="hero-nav-links">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-link ${activeSection === id ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, id)}
              >
                {label}
              </a>
            ))}
          </nav>
        </motion.div>

        <motion.div
          className="hero-content"
          style={{
            opacity: contentOpacity,
            scale: contentScale,
            pointerEvents: collapsed ? 'none' : 'auto',
          }}
        >
          <h1 className="hero-logo" data-text="TWILIGHT CODERS">TWILIGHT CODERS</h1>
          <p className="hero-tagline">Dream. Code.</p>
        </motion.div>

        <motion.button
          className="scroll-indicator"
          onClick={scrollToProducts}
          style={{ opacity: contentOpacity, pointerEvents: collapsed ? 'none' : 'auto' }}
          aria-label="Scroll to products"
        >
          <ChevronDown size={28} />
        </motion.button>
      </motion.header>

      <div className="hero-spacer" />
    </>
  );
};

export default HeroSection;
