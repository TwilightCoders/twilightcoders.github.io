import { useState, useEffect } from 'react';
import { fetchRepositories } from '../services/githubApi';

// Cache configuration
const CACHE_KEY = 'twilight-coders-repos';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Get cached repositories if they exist and are still valid
 * @returns {Array|null} Cached repositories or null if not found/expired
 */
const getCachedRepositories = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.warn('Error reading from cache:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

/**
 * Cache repositories data
 * @param {Array} repositories - Repository data to cache
 */
const setCachedRepositories = (repositories) => {
  try {
    const cacheData = {
      data: repositories,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error writing to cache:', error);
  }
};

/**
 * Custom hook for fetching and managing GitHub repository data
 * @param {number} limit - Maximum number of repositories to fetch
 * @returns {Object} { repositories, loading, error, refetch }
 */
export const useGitHubData = (limit = 6) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cachedRepos = getCachedRepositories();
        if (cachedRepos) {
          setRepositories(cachedRepos);
          setLoading(false);
          return;
        }
      }
      
      // Fetch fresh data
      const repos = await fetchRepositories(limit);
      setRepositories(repos);
      
      // Cache the results
      setCachedRepositories(repos);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch GitHub data:', err);
      
      // Try to use cached data even if expired, as fallback
      const cachedRepos = getCachedRepositories();
      if (cachedRepos) {
        setRepositories(cachedRepos);
        console.warn('Using expired cache data due to API failure');
      } else {
        // Final fallback to placeholder data
        setRepositories(createFallbackData());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  const refetch = (forceRefresh = false) => {
    fetchData(forceRefresh);
  };

  return {
    repositories,
    loading,
    error,
    refetch
  };
};

/**
 * Create fallback data when GitHub API is unavailable
 * @returns {Array} Placeholder repository data
 */
const createFallbackData = () => [
  {
    id: 'fallback-1',
    index: 0,
    name: 'Project Alpha',
    description: 'A revolutionary approach to solving complex problems with elegant solutions.',
    url: '#',
    stars: 42,
    language: 'JavaScript',
    displayDescription: 'A revolutionary approach to solving complex problems with elegant solutions.'
  },
  {
    id: 'fallback-2', 
    index: 1,
    name: 'Project Beta',
    description: 'Cutting-edge technology meets practical application in this innovative tool.',
    url: '#',
    stars: 28,
    language: 'TypeScript',
    displayDescription: 'Cutting-edge technology meets practical application in this innovative tool.'
  },
  {
    id: 'fallback-3',
    index: 2,
    name: 'Project Gamma',
    description: 'Open-source contribution to the developer community with modern best practices.',
    url: '#',
    stars: 15,
    language: 'Python',
    displayDescription: 'Open-source contribution to the developer community with modern best practices.'
  },
  {
    id: 'fallback-4',
    index: 3,
    name: 'Project Delta',
    description: 'Advanced analytics platform that transforms raw data into actionable insights.',
    url: '#',
    stars: 67,
    language: 'React',
    displayDescription: 'Advanced analytics platform that transforms raw data into actionable insights.'
  },
  {
    id: 'fallback-5',
    index: 4,
    name: 'Project Epsilon',
    description: 'AI-powered automation suite that streamlines repetitive tasks and enhances productivity.',
    url: '#',
    stars: 33,
    language: 'Python',
    displayDescription: 'AI-powered automation suite that streamlines repetitive tasks and enhances productivity.'
  },
  {
    id: 'fallback-6',
    index: 5,
    name: 'Project Zeta',
    description: 'Modern web application framework with built-in performance optimizations.',
    url: '#',
    stars: 89,
    language: 'JavaScript',
    displayDescription: 'Modern web application framework with built-in performance optimizations.'
  }
];