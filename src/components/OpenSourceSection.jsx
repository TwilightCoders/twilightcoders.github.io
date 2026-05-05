import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useGitHubData } from '../hooks/useGitHubData';
import RepoCard from './RepoCard';
import './OpenSourceSection.scss';

const OpenSourceSection = () => {
  const { repositories, loading, error } = useGitHubData(12);

  return (
    <section id="open-source" className="open-source-section">
      <motion.h2
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Open Source
      </motion.h2>

      {loading && (
        <div className="repos-loading">Loading repositories...</div>
      )}

      {error && !repositories.length && (
        <div className="repos-error">Could not load repositories.</div>
      )}

      <div className="repos-grid">
        {repositories.map((repo, index) => (
          <RepoCard key={repo.id} repo={repo} index={index} />
        ))}
      </div>

      <motion.div
        className="repos-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <a
          href="https://github.com/TwilightCoders"
          target="_blank"
          rel="noopener noreferrer"
          className="view-all-link"
        >
          View all on GitHub
          <ExternalLink size={16} />
        </a>
      </motion.div>
    </section>
  );
};

export default OpenSourceSection;
