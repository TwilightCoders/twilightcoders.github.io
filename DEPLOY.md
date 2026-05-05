# Deployment Guide

## Two Deployment Methods

This project supports two deployment workflows:

### Method 1: GitHub Actions (Recommended)
Push to the private repo and let GitHub Actions handle the build and deployment:

```bash
git add .
git commit -m "Update site"
git push origin main
```

GitHub Actions will automatically build and deploy to the public `twilightcoders.github.io` repository.

### Method 2: Direct Deploy
Build locally and push directly to the public repository:

```bash
npm run deploy
```

This command will:
1. Build the project locally (`npm run build`)
2. Push the `dist` folder directly to the `twilightcoders.github.io` repository
3. Site updates immediately on GitHub Pages

### Prerequisites

1. Push access to both `TwilightCoders/www` (private) and `twilightcoders.github.io` (public)
2. Local git configured with the correct SSH credentials

### Configuration

- **Homepage URL**: `https://twilightcoders.net`
- **Build Output**: `dist/` (Vite default)
- **Deploy Branch**: `gh-pages`

### Manual Steps (if needed)

If you need to deploy manually:

```bash
# Build the project
npm run build

# Deploy using gh-pages
npx gh-pages -d dist
```

### Notes

- The `predeploy` script automatically builds before deploying
- The deploy uses `NODE_NO_WARNINGS=1` to suppress Node.js warnings
- The site should be available at `https://twilightcoders.net` after deployment
- **CNAME file**: Automatically included in builds from `public/CNAME` to preserve custom domain
- Both deployment methods will maintain the custom domain configuration