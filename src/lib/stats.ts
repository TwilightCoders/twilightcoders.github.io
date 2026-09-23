// Live numbers, fetched once per build. Three requests in total: the org's
// public repos, the maintainer's RubyGems list and one gem that list omits. Uses GITHUB_TOKEN when present (CI); anonymous otherwise.
// Any failure falls back to the researched values in src/data/projects.ts,
// so the build never depends on the network.

import { projects, type Project } from '../data/projects';

export interface RepoStats {
  stars: number;
  pushedAt: string | null;
  license: string | null;
}

export interface GemStats {
  downloads: number;
  version: string;
}

export interface Stats {
  repos: Map<string, RepoStats>;
  gems: Map<string, GemStats>;
  totals: { stars: number; downloads: number; originals: number };
  live: boolean;
}

// Gems on the maintainer's RubyGems account that are not ours to count:
// gemplate is Les Aker's gem; sudo was created by Guido De Rosa.
const EXCLUDED_GEMS = new Set(['gemplate', 'sudo']);
// Owned gems not returned by the owner listing.
const EXTRA_GEMS = ['active_record-mti'];

const FALLBACK_TOTALS = { stars: 148, downloads: 571_992, originals: 56 };

async function getJSON<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const response = await fetch(url, { headers: { 'User-Agent': 'twilightcoders.net-build', ...headers } });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json() as Promise<T>;
}

interface GhRepo {
  full_name: string;
  fork: boolean;
  stargazers_count: number;
  pushed_at: string;
  license: { spdx_id: string } | null;
}

interface RgGem {
  name: string;
  downloads: number;
  version: string;
}

async function load(): Promise<Stats> {
  const gh: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) gh.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [org, owned, ...extra] = await Promise.all([
      getJSON<GhRepo[]>('https://api.github.com/orgs/TwilightCoders/repos?per_page=100&type=public', gh),
      getJSON<RgGem[]>('https://rubygems.org/api/v1/owners/voltechs/gems.json'),
      ...EXTRA_GEMS.map((g) => getJSON<RgGem>(`https://rubygems.org/api/v1/gems/${g}.json`)),
    ]);

    const repos = new Map<string, RepoStats>();
    for (const r of org) {
      repos.set(r.full_name, {
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        license: r.license && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : null,
      });
    }

    const gems = new Map<string, GemStats>();
    for (const g of [...owned, ...extra]) gems.set(g.name, { downloads: g.downloads, version: g.version });

    const originals = org.filter((r) => !r.fork);
    return {
      repos,
      gems,
      totals: {
        stars: originals.reduce((sum, r) => sum + r.stargazers_count, 0),
        downloads: [...gems.entries()]
          .filter(([name]) => !EXCLUDED_GEMS.has(name))
          .reduce((sum, [, g]) => sum + g.downloads, 0),
        originals: originals.length,
      },
      live: true,
    };
  } catch (error) {
    console.warn(`[stats] using researched fallbacks: ${(error as Error).message}`);
    return { repos: new Map(), gems: new Map(), totals: FALLBACK_TOTALS, live: false };
  }
}

let cached: Promise<Stats> | undefined;
export const getStats = () => (cached ??= load());

export interface ProjectStats {
  stars?: number;
  downloads?: number;
  version?: string;
  pushedAt?: string | null;
  license?: string | null;
}

export async function statsFor(project: Project): Promise<ProjectStats> {
  const { repos, gems } = await getStats();
  const repo = project.repo ? repos.get(project.repo) : undefined;
  const gem = project.gem ? gems.get(project.gem) : undefined;
  return {
    stars: repo?.stars ?? project.fallback?.stars,
    downloads: gem?.downloads ?? project.fallback?.downloads,
    version: gem?.version ?? project.fallback?.version,
    pushedAt: repo?.pushedAt ?? null,
    license: repo?.license ?? null,
  };
}

export { floorFigure, compact } from './format';
export { projects };
