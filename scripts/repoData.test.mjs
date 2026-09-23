import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractReadmeTitle, selectRepositories, toDisplayRepository, REPOSITORY_BLOCKLIST,
} from '../src/services/repoData.js';

const repo = (name, stars, updated, extra = {}) => ({
  id: name.length, name, stargazers_count: stars, updated_at: updated,
  html_url: `https://github.com/TwilightCoders/${name}`, ...extra,
});

test('extractReadmeTitle takes the first heading and drops badges', () => {
  assert.equal(extractReadmeTitle('# QuickCount [![Build](x)](y)\n\ntext'), 'QuickCount');
  assert.equal(extractReadmeTitle('intro\n## Sub Title\n'), 'Sub Title');
  assert.equal(extractReadmeTitle(null), null);
  assert.equal(extractReadmeTitle('no headings here'), null);
});

test('selectRepositories drops blocklisted, sorts by stars then recency, trims', () => {
  const repos = [
    repo('old', 5, '2020-01-01'),
    repo(REPOSITORY_BLOCKLIST[0], 999, '2026-01-01'),
    repo('new', 5, '2026-01-01'),
    repo('popular', 97, '2019-01-01'),
  ];
  assert.deepEqual(selectRepositories(repos, 3).map(r => r.name), ['popular', 'new', 'old']);
  assert.deepEqual(selectRepositories(repos, 1).map(r => r.name), ['popular']);
});

test('toDisplayRepository prefers the README title and fills description fallbacks', () => {
  const shaped = toDisplayRepository(repo('alta_labs', 1, '2026-01-01', { language: 'Ruby', description: null }), 4, null);
  assert.equal(shaped.displayName, 'alta_labs');
  assert.equal(shaped.index, 4);
  assert.equal(shaped.description, 'No description available');
  assert.equal(shaped.displayDescription, 'A Ruby project by Twilight Coders');
  assert.deepEqual(shaped.topics, []);
  assert.equal(toDisplayRepository(repo('x', 0, '2026-01-01'), 0, '# Pretty Name').displayName, 'Pretty Name');
});
