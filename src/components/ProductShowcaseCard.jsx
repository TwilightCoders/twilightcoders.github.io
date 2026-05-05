import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import './ProductShowcaseCard.scss';

const ProductShowcaseCard = ({ product, index }) => {
  const isImageIcon = product.icon.startsWith('/');

  return (
    <motion.a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="product-icon">
        {isImageIcon ? (
          <img src={product.icon} alt={`${product.name} icon`} className="product-icon-img" />
        ) : (
          product.icon
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-tagline">{product.tagline}</p>
        {product.tech && (
          <span className="product-tech">{product.tech}</span>
        )}
      </div>
      <div className="product-cta">
        <ExternalLink size={18} />
      </div>
    </motion.a>
  );
};

export default ProductShowcaseCard;
