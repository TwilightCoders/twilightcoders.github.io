import { motion } from 'framer-motion';
import ProductShowcaseCard from './ProductShowcaseCard';
import './ProductsSection.scss';

const products = [
  {
    name: 'Products',
    tagline: 'ClaudePilot, Upuppy and our other commercial apps live at twilightcoders.com',
    icon: '/icons/upuppy.png',
    tech: 'twilightcoders.com',
    url: 'https://twilightcoders.com/#products',
  },
  {
    name: 'Galaxer',
    tagline: 'Real-time multiplayer space conquest game — deploy ships to capture enemy planets',
    icon: '/icons/galaxer.png',
    tech: 'C++ / SFML',
    url: 'https://galaxer.net',
  },
  {
    name: 'Monopolia',
    tagline: 'Time-slider visualization showing how industries consolidate through mergers over time',
    icon: '📊',
    tech: 'React / D3.js',
    url: 'https://twilightcoders.net/monopolia/',
  },
];

const ProductsSection = () => {
  return (
    <section id="projects" className="products-section">
      <motion.h2
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Projects
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
