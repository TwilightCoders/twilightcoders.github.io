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
            This is the open-source home of Twilight Coders: the Ruby gems, developer tools and
            experiments we build in the open and maintain for anyone to use.
          </p>
          <p>
            Looking for our apps, support or a way to get in touch? Head to{' '}
            <a href="https://twilightcoders.com">twilightcoders.com</a>.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
