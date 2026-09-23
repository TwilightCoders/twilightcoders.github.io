import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { projects, featured, areas, contributions, upcoming } from '../src/data/projects.ts';

// Repos that must never be presented as ours: other people's work, empty stubs,
// and gems whose RubyGems name belongs to someone else (docs/research/).
const NOT_OURS = [
  'card-games', 'NodeCardGames', 'serverless-api', 'gemplate', 'truenas-apps', 'GCalSync',
  'active_enum', 'angular-rails', 'apie', 'prodekal', 'rails-ifttt', 'athena', 'erlang_parser',
  'iocage-plugin-seafile', 'warren',
];

// Private or not-yet-announced work that must not get a public listing or page.
const NOT_PUBLIC = ['voltechs/museum', 'TwilightCoders/progresql', 'TwilightCoders/active_record-progresql', 'voltechs/galaxer.net'];

test('unannounced work is not listed', () => {
  for (const p of projects) {
    assert.ok(!p.repo || !NOT_PUBLIC.includes(p.repo), `${p.slug} lists ${p.repo}`);
    const text = JSON.stringify(p);
    assert.ok(!/museum|twilight collection|progresql/i.test(text), `${p.slug} mentions unannounced work`);
  }
});

test('sneak peeks stay brief and unlinked', () => {
  for (const u of upcoming) {
    assert.ok(u.summary.length < 320, `${u.name}: sneak peek is too long`);
    assert.ok(!/https?:\/\//.test(u.summary), `${u.name}: sneak peek links out`);
  }
});

test('slugs are unique', () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every project is in a known area and has real copy', () => {
  const ids = new Set(areas.map((a) => a.id));
  for (const p of projects) {
    assert.ok(ids.has(p.area), `${p.slug}: unknown area ${p.area}`);
    assert.ok(p.tagline.length > 20, `${p.slug}: tagline too thin`);
    assert.ok(!/a (ruby|software) project by/i.test(p.tagline), `${p.slug}: boilerplate tagline`);
    assert.ok(p.since >= 2003 && p.since <= new Date().getFullYear(), `${p.slug}: since ${p.since}`);
    assert.ok(p.links.length > 0, `${p.slug}: no links`);
  }
});

test('all links are https', () => {
  const hrefs = [...projects.flatMap((p) => p.links.map((l) => l.href)), ...contributions.map((c) => c.href)];
  for (const href of hrefs) assert.match(href, /^https:\/\//, href);
});

test('nothing that is not ours is presented as ours', () => {
  for (const p of projects) {
    const name = p.repo?.split('/')[1];
    assert.ok(!name || !NOT_OURS.includes(name), `${p.slug} points at ${p.repo}`);
  }
});

test('featured projects have a visual and their images exist', () => {
  assert.ok(featured.length >= 6);
  for (const p of featured) {
    const f = p.featured!;
    assert.ok(f.media?.length || f.snippets?.length, `${p.slug}: no media or snippet`);
    assert.ok(f.body.length >= 2 && f.highlights.length >= 3, `${p.slug}: detail page too thin`);
    for (const m of f.media ?? []) {
      assert.ok(existsSync(new URL(`../src/assets/work/${m.src}`, import.meta.url)), `${p.slug}: missing ${m.src}`);
      assert.ok(m.alt.length > 20, `${p.slug}: alt text for ${m.src} is too thin`);
    }
  }
});
