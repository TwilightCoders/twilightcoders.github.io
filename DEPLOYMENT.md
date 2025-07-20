# GitHub Pages Deployment Setup

This repo uses a private-to-public deployment strategy to host on GitHub Pages while keeping the source code private.

## Setup Steps

### 1. Create Public Repository
Create a new **public** repository for hosting:
- Repository name: `twilightcoders.github.io` (or `your-username.github.io`)
- Make it public
- Initialize with README
- Enable GitHub Pages in Settings → Pages → Source: Deploy from a branch → main

### 2. Generate Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with these permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
3. Copy the token (you won't see it again!)

### 3. Add Secret to Private Repository
1. In this private repo, go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `DEPLOY_TOKEN`
4. Value: Paste your personal access token
5. Click "Add secret"

### 4. Update Workflow Configuration
Edit `.github/workflows/deploy.yml` and replace:
- `TwilightCoders/twilightcoders.github.io` with your actual public repo name

### 5. Trigger Deployment
Push to main branch or manually trigger the workflow:
- Go to Actions tab
- Select "Deploy to GitHub Pages" workflow  
- Click "Run workflow"

## How It Works

1. **Build**: GitHub Actions builds the Vite project in this private repo
2. **Deploy**: The built files (`dist/`) are pushed to the public repo
3. **Serve**: GitHub Pages serves the files from the public repo

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the public repo with your domain
2. Configure DNS to point to `your-username.github.io`
3. Enable HTTPS in the public repo's Pages settings

## Troubleshooting

- **Build fails**: Check the Actions logs for Node/npm errors
- **Deploy fails**: Verify the DEPLOY_TOKEN has correct permissions
- **Pages not updating**: Check the public repo's Pages settings
- **404 errors**: Ensure the build output is in `dist/` directory

## Security Note

The personal access token has full repo access, so keep it secure. Consider creating a dedicated GitHub account for deployments if you prefer more isolation.