// GitHub API service for fetching TwilightCoders repositories

const GITHUB_API_BASE = 'https://api.github.com';
const ORG_NAME = 'TwilightCoders';

// Repository blocklist - add repository names you don't want to display
const REPOSITORY_BLOCKLIST = [
  // Add repository names here to exclude them from the carousel
  'ergane',
  'foo_table-rails', 
  'FreeNAS-Rails-Setup'
];

// Pinned repositories - manually configure which repos should appear first
const REPOSITORY_INSISTLIST = [
  // Add repository names here to pin them to the top of the carousel
];

/**
 * Extract title from README markdown content
 * @param {string} readmeContent - Raw README markdown content
 * @returns {string|null} Extracted title or null if not found
 */
const extractReadmeTitle = (readmeContent) => {
  if (!readmeContent) return null;
  
  // Look for the first # heading
  const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    let title = titleMatch[1].trim();
    
    // Clean up title by removing badge syntax and other markdown artifacts
    title = cleanTitle(title);
    
    return title || null;
  }
  
  // Fallback: look for any heading in the first few lines
  const lines = readmeContent.split('\n').slice(0, 10);
  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      let title = headingMatch[1].trim();
      title = cleanTitle(title);
      if (title) return title;
    }
  }
  
  return null;
};

/**
 * Clean up extracted title by truncating at unreasonable title characters
 * @param {string} title - Raw title text
 * @returns {string} Cleaned title
 */
const cleanTitle = (title) => {
  if (!title) return '';
  
  // Truncate at first occurrence of unreasonable title characters like [!
  const match = title.match(/^([^[!]*)/);
  return match ? match[1].trim() : title.trim();
};

/**
 * Get pinned repository names (manual insist list)
 * @returns {Array} Array of pinned repository names
 */
const getPinnedRepositories = () => REPOSITORY_INSISTLIST;

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
    // Fetch a larger set to ensure we have enough after filtering and sorting
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${ORG_NAME}/repos?per_page=100&type=public`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const repos = await response.json();
    
    // Filter out blocklisted repositories
    const filteredRepos = repos.filter(repo => !REPOSITORY_BLOCKLIST.includes(repo.name));
    
    // Get pinned repositories (both homepage and manual insist list)
    const pinnedRepoNames = getPinnedRepositories();
    
    // Sort repositories by priority: pinned > stars > recent activity
    const sortedRepos = filteredRepos.sort((a, b) => {
      const aIsPinned = pinnedRepoNames.includes(a.name);
      const bIsPinned = pinnedRepoNames.includes(b.name);
      
      // First priority: pinned repositories
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      
      // Second priority: star count (descending)
      if (a.stargazers_count !== b.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      
      // Third priority: recent activity (descending)
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    
    // Take only the requested number of repositories
    const limitedRepos = sortedRepos.slice(0, limit);
    
    // Fetch README titles for each repository in parallel
    const reposWithTitles = await Promise.all(
      limitedRepos.map(async (repo, index) => {
        let displayName = repo.name;
        
        try {
          const readme = await fetchRepositoryReadme(repo.name);
          const readmeTitle = extractReadmeTitle(readme);
          if (readmeTitle) {
            displayName = readmeTitle;
          }
        } catch (error) {
          console.log(`Could not fetch README for ${repo.name}, using repo name`);
        }
        
        return {
          id: repo.id,
          index: index,
          name: repo.name, // Keep original name for URL purposes
          displayName: displayName, // Use for display
          description: repo.description || 'No description available',
          url: repo.html_url,
          homepage: repo.homepage,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updatedAt: repo.updated_at,
          createdAt: repo.created_at,
          topics: repo.topics || [],
          isPrivate: repo.private,
          // Fallback for repositories without descriptions
          displayDescription: repo.description || `A ${repo.language || 'software'} project by Twilight Coders`
        };
      })
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