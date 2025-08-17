import { useState, useEffect } from 'react';
import { fetchRepositories } from '../services/githubApi';

/**
 * Custom hook for fetching and managing GitHub repository data
 * @param {number} limit - Maximum number of repositories to fetch
 * @returns {Object} GitHub data state and loading/error states
 */
export const useGitHubData = (limit = 6) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const repos = await fetchRepositories(limit);
        setRepositories(repos);
      } catch (err) {
        console.error('Error loading GitHub repositories:', err);
        setError(err.message);
        
        // Try to use any cached data that might exist
        // If there's no cache, repositories will remain empty array
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, [limit]);

  return {
    repositories,
    loading,
    error
  };
};