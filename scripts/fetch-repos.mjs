// Build-time snapshot of the Open Source grid.
//
// Writes public/repos.json so visitors never call the GitHub API themselves
// (unauthenticated browsers get 60 requests/hour per IP, and the grid empties
// when that runs out). Uses GITHUB_TOKEN when set (CI), anonymous otherwise.
// Never fails the build: on any error it leaves no snapshot, and the page
// falls back to fetching live.

import { writeFile, rm } from 'node:fs/promises';
import { selectRepositories, toDisplayRepository } from '../src/services/repoData.js';

const ORG_NAME = 'TwilightCoders';
const LIMIT = 24; // OpenSourceSection shows 12; keep headroom
const OUT = new URL('../public/repos.json', import.meta.url);

const headers = { 'User-Agent': 'twilightcoders.net-build' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const get = async (path, accept = 'application/vnd.github+json') => {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { ...headers, Accept: accept },
  });
  return response;
};

try {
  const response = await get(`/orgs/${ORG_NAME}/repos?per_page=100&type=public`);
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  const repos = await response.json();

  const display = await Promise.all(
    selectRepositories(repos, LIMIT).map(async (repo, index) => {
      const readme = await get(`/repos/${ORG_NAME}/${repo.name}/readme`, 'application/vnd.github.raw');
      return toDisplayRepository(repo, index, readme.ok ? await readme.text() : null);
    })
  );

  await writeFile(OUT, JSON.stringify(display, null, 2) + '\n');
  console.log(`repos.json: ${display.length} repositories`);
} catch (error) {
  await rm(OUT, { force: true });
  console.warn(`repos.json skipped (${error.message}); the page will fetch live`);
}
