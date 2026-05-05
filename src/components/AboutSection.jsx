import { motion } from 'framer-motion';
import './AboutSection.scss';

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading">About</h2>
        <div className="about-content">
          <p>
            We're a creative development collective focused on building innovative web solutions
            and contributing to the open-source community. Our passion lies in crafting elegant
            code that solves real problems and pushes the boundaries of what's possible.
          </p>
          <p>
            From React applications to Ruby gems, from AI integrations to developer tools — we
            believe in the power of thoughtful engineering and clean architecture to create
            software that stands the test of time.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
