# twilightcoders.net

The open-source home of Twilight Coders. Commercial products live at
[twilightcoders.com](https://twilightcoders.com).

This is the organisation's GitHub Pages user site, so it owns the
`twilightcoders.net` custom domain for every project site too
(`twilightcoders.net/monopolia/`, …).

## Develop

```bash
npm ci
npm run dev
```

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds with Vite and publishes
`dist/` through GitHub Pages. `public/CNAME` carries the custom domain.

## History

`main` carries the full source history, which began in the private
`TwilightCoders/www` repo. Earlier eras are kept as branches:

| Branch | Contents |
|---|---|
| `archive/source-2018` | Original 2018 React/Relay source |
| `archive/deploys-2018` | 2018 build output |
| `archive/deploys-2025` | 2025 build output pushed here from the private repo |
| `archive/www-gh-pages-2025` | Build output from the private repo's own `gh-pages` |
| `archive/attempts` | 2025 design experiments |
