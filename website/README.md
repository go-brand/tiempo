# tiempo Landing Page

Simple, modern landing page for the tiempo library.

## Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `website`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
6. Click "Deploy"

Vercel will automatically deploy whenever you push changes to the `website` folder.

### Option 2: Vercel CLI

```bash
cd website
npx vercel
```

Follow the prompts to deploy.

## Deploy to Cloudflare Pages

### Option 1: Automatic Deployment via Dashboard

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to Workers & Pages → Create application → Pages → Connect to Git
4. Select your repository
5. Configure the build:
   - **Project name**: tiempo
   - **Production branch**: main
   - **Build command**: (leave empty)
   - **Build output directory**: website
6. Click "Save and Deploy"

Cloudflare will automatically deploy whenever you push changes to the `website` folder.

### Option 2: Wrangler CLI

```bash
cd website
npx wrangler pages deploy . --project-name=tiempo
```

## Local Development

Simply open `index.html` in your browser:

```bash
open index.html
```

Or use a local server:

```bash
npx serve .
```

## Structure

- `index.html` - Single-page website with embedded CSS and minimal JavaScript
- `vercel.json` - Vercel configuration for clean URLs
- `README.md` - This file

## Features

- Zero build step - pure HTML/CSS/JS
- Responsive design
- Dark mode by default
- Syntax-highlighted code examples
- Copy-to-clipboard functionality
- Fast loading with no external dependencies
