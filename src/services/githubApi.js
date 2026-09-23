// GitHub API service for fetching TwilightCoders repositories

import { selectRepositories, toDisplayRepository } from './repoData.js';

const GITHUB_API_BASE = 'https://api.github.com';
const ORG_NAME = 'TwilightCoders';

// Persistent cache using localStorage to avoid hitting rate limits
const CACHE_KEY = 'twilight_coders_repos';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      return { data, timestamp };
    }
  } catch (error) {
    console.warn('Error reading cache:', error);
  }
  return { data: null, timestamp: null };
};

const setCache = (data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error setting cache:', error);
  }
};

/**
 * Load the repository snapshot generated at build time
 * @returns {Promise<Array|null>} Display-ready repositories, or null if unavailable
 */
const fetchRepositorySnapshot = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}repos.json`);
    if (!response.ok) return null;
    const repos = await response.json();
    return Array.isArray(repos) && repos.length ? repos : null;
  } catch {
    return null;
  }
};

/**
 * Fetch repositories for the TwilightCoders organization
 * @param {number} limit - Maximum number of repositories to fetch
 * @returns {Promise<Array>} Array of repository objects
 */
export const fetchRepositories = async (limit = 6) => {
  // Check persistent cache first
  const { data: cachedData, timestamp: cachedTimestamp } = getCache();
  if (cachedData && cachedTimestamp && 
      Date.now() - cachedTimestamp < CACHE_DURATION) {
    console.log('Using cached repository data from localStorage');
    return cachedData.slice(0, limit);
  }
  try {
    // Prefer the snapshot written at build time (scripts/fetch-repos.mjs)
    const snapshot = await fetchRepositorySnapshot();
    if (snapshot) {
      setCache(snapshot);
      return snapshot.slice(0, limit);
    }

    // Fetch a larger set to ensure we have enough after filtering and sorting
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${ORG_NAME}/repos?per_page=100&type=public`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();

    // Fetch README titles for each repository in parallel
    const reposWithTitles = await Promise.all(
      selectRepositories(repos, limit).map(async (repo, index) =>
        toDisplayRepository(repo, index, await fetchRepositoryReadme(repo.name))
      )
    );

    // Cache the results persistently
    setCache(reposWithTitles);
    
    return reposWithTitles;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    
    // If we have cached data (even stale), return it instead of throwing
    const { data: cachedData } = getCache();
    if (cachedData) {
      console.log('API failed, returning cached repository data (possibly stale)');
      return cachedData.slice(0, limit);
    }
    
    throw error;
  }
};

/**
 * Fetch a specific repository with additional details
 * @param {string} repoName - Name of the repository
 * @returns {Promise<Object>} Repository object with additional details
 */
export const fetchRepository = async (repoName) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching repository ${repoName}:`, error);
    throw error;
  }
};

/**
 * Fetch README content for a repository
 * @param {string} repoName - Name of the repository
 * @returns {Promise<string>} README content as markdown
 */
export const fetchRepositoryReadme = async (repoName) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    if (!response.ok) {
      // README not found is common, don't throw error
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error);
    return null;
  }
};

/**
 * Get language color mapping for badge styling
 * @param {string} language - Programming language name
 * @returns {string} Hex color code for the language
 */
export const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    SCSS: '#c6538c',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Svelte: '#ff3e00',
    Shell: '#89e051',
    PowerShell: '#012456',
    Dockerfile: '#384d54'
  };
  
  return colors[language] || '#858585';
};