// Pure repository selection and shaping, shared by the browser
// (src/services/githubApi.js) and the build-time snapshot (scripts/fetch-repos.mjs).

// Repository blocklist - add repository names you don't want to display
export const REPOSITORY_BLOCKLIST = [
  // Add repository names here to exclude them from the carousel
  'ergane',
  'foo_table-rails', 
  'FreeNAS-Rails-Setup'
];

// Pinned repositories - manually configure which repos should appear first
export const REPOSITORY_INSISTLIST = [
  // Add repository names here to pin them to the top of the carousel
];

/**
 * Extract title from README markdown content
 * @param {string} readmeContent - Raw README markdown content
 * @returns {string|null} Extracted title or null if not found
 */
export const extractReadmeTitle = (readmeContent) => {
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
export const cleanTitle = (title) => {
  if (!title) return '';
  
  // Truncate at first occurrence of unreasonable title characters like [!
  const match = title.match(/^([^[!]*)/);
  return match ? match[1].trim() : title.trim();
};

/**
 * Filter, prioritise and trim raw GitHub repositories
 * @param {Array} repos - Raw repository objects from the GitHub REST API
 * @param {number} limit - Maximum number of repositories to keep
 * @returns {Array} Selected raw repositories, pinned > stars > recent activity
 */
export const selectRepositories = (repos, limit) => {
  const filteredRepos = repos.filter(repo => !REPOSITORY_BLOCKLIST.includes(repo.name));

  const sortedRepos = filteredRepos.sort((a, b) => {
    const aIsPinned = REPOSITORY_INSISTLIST.includes(a.name);
    const bIsPinned = REPOSITORY_INSISTLIST.includes(b.name);

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

  return sortedRepos.slice(0, limit);
};

/**
 * Shape a raw repository into the object RepoCard renders
 * @param {Object} repo - Raw repository object from the GitHub REST API
 * @param {number} index - Position in the list
 * @param {string|null} readme - Raw README markdown, if any
 * @returns {Object} Display-ready repository
 */
export const toDisplayRepository = (repo, index, readme) => ({
  id: repo.id,
  index: index,
  name: repo.name, // Keep original name for URL purposes
  displayName: extractReadmeTitle(readme) || repo.name, // Use for display
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
});
