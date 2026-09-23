# twilightcoders.net

The open-source home of Twilight Coders, LLC. Commercial products live at
[twilightcoders.com](https://twilightcoders.com).

This is the organization's GitHub Pages user site, so it owns the
`twilightcoders.net` custom domain for every project site too
(`twilightcoders.net/monopolia/`, …). Don't add pages whose paths collide with a
repository name.

## Stack

[Astro](https://astro.build), static output, no client JavaScript. Display type
is self-hosted Fraunces; everything else uses system fonts. Design notes are in
[docs/DESIGN.md](docs/DESIGN.md).

## Content

- `src/data/projects.ts`: the curated catalog. Every project, its copy, links and
  (for featured work) its detail page. Copy is written from each project's README
  and code; don't add a project without reading its source first.
- `src/assets/work/`: screenshots, optimized to AVIF/WebP at build time.
- `src/lib/stats.ts`: stars, downloads and versions, fetched from GitHub and
  RubyGems once per build (with `GITHUB_TOKEN` in CI). If those APIs fail, the
  build uses the `fallback` values in `projects.ts`.

## Develop

```bash
npm ci
npm run dev     # http://localhost:4321
npm test        # data integrity and formatting tests
npm run build   # static site in dist/
```

## Deploy

Push to `main`. `.github/workflows/deploy.yml` runs the tests, builds, and
publishes `dist/` through GitHub Pages. `public/CNAME` carries the custom domain.

## History

`main` carries the full source history, which began in the private
`TwilightCoders/www` repo. Earlier eras are kept as branches:

| Branch | Contents |
|---|---|
| `archive/deploys-2018` | 2018 build output |
| `archive/deploys-2025` | 2025 build output pushed here from the private repo |
| `archive/www-gh-pages-2025` | Build output from the private repo's own `gh-pages` |
| `archive/attempts` | 2025 design experiments |
