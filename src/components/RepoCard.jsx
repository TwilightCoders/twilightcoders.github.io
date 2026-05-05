import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getLanguageColor } from '../services/githubApi';
import './RepoCard.scss';

const RepoCard = ({ repo, index }) => {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="repo-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <h3 className="repo-name">{repo.displayName || repo.name}</h3>
      <p className="repo-description">{repo.displayDescription}</p>
      <div className="repo-meta">
        {repo.language && (
          <span className="repo-language">
            <span
              className="language-dot"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="repo-stars">
            <Star size={14} />
            {repo.stars}
          </span>
        )}
      </div>
    </motion.a>
  );
};

export default RepoCard;
