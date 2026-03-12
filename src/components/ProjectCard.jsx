import { getLanguageColor } from '../services/githubApi';
import { Github, ExternalLink } from 'lucide-react';
import './ProjectCard.scss';

const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="project-card">
      <div className="card-header">
        <h3 className="project-title">{project.name}</h3>
        <div className="project-links">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
            aria-label="View on GitHub"
          >
            <Github size={16} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
              aria-label="View live site"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <p className="project-description">
        {project.description || 'No description available'}
      </p>

      {/* Language badges */}
      {project.language && (
        <div className="project-languages">
          <span 
            className="language-badge"
            style={{
              backgroundColor: getLanguageColor(project.language),
              color: '#fff'
            }}
          >
            {project.language}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="project-stats">
        <span className="stat">⭐ {project.stargazers_count}</span>
        <span className="stat">🍴 {project.forks_count}</span>
      </div>
    </div>
  );
};

export default ProjectCard;