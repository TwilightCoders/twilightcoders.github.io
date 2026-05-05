import { motion } from 'framer-motion';
import ProductShowcaseCard from './ProductShowcaseCard';
import './ProductsSection.scss';

const products = [
  {
    name: 'ClaudePilot',
    tagline: 'CLI for managing tmux + Claude Code sessions',
    icon: '/icons/claudepilot.png',
    tech: 'Ruby / macOS',
    url: 'https://github.com/TwilightCoders/claudepilot',
  },
  {
    name: 'Upuppy',
    tagline: 'A native macOS menu bar app that monitors Statuspage-compatible services with native notifications',
    icon: '/icons/upuppy.png',
    tech: 'Swift / macOS',
    url: 'https://github.com/TwilightCoders/upuppy',
  },
  {
    name: 'Entropy',
    tagline: 'AI-powered file organizer that brings order to digital chaos',
    icon: '/icons/entropy.png',
    tech: 'Ruby / Tauri',
    url: 'https://github.com/TwilightCoders/entropy',
  },
  {
    name: 'Galaxer',
    tagline: 'Real-time multiplayer space conquest game — deploy ships to capture enemy planets',
    icon: '/icons/galaxer.png',
    tech: 'C++ / SFML',
    url: 'https://github.com/TwilightCoders/galaxer',
  },
  {
    name: 'PicUrs',
    tagline: 'Intelligent photo library culler for Apple Photos',
    icon: '🖼️',
    tech: 'Python / React',
    url: 'https://github.com/TwilightCoders/pic_urs',
  },
  {
    name: 'CodeJump',
    tagline: 'Quickly switch between VS Code windows with a fuzzy QuickPick',
    icon: '⚡',
    tech: 'VS Code Extension',
    url: 'https://github.com/TwilightCoders/codejump',
  },
  {
    name: 'Monopolia',
    tagline: 'Time-slider visualization showing how industries consolidate through mergers over time',
    icon: '📊',
    tech: 'React / D3.js',
    url: 'https://github.com/TwilightCoders/monopolia',
  },
];

const ProductsSection = () => {
  return (
    <section id="products" className="products-section">
      <motion.h2
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Products
      </motion.h2>
      <div className="products-stack">
        {products.map((product, index) => (
          <ProductShowcaseCard key={product.name} product={product} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
