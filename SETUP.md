# Setup Guide for tiempo

This guide will help you push the repository to GitHub and prepare it for publishing.

## Step 1: Push to GitHub

The repository is already initialized with git and connected to GitHub. Push it:

```bash
cd ~/Desktop/tiempo
git push -u origin main
```

## Step 2: Verify GitHub Actions

Once pushed, GitHub Actions will automatically:
- Run tests on Node 20.x and 22.x
- Type check the code
- Build the package

Check the Actions tab: https://github.com/go-brand/tiempo/actions

## Step 3: Update package.json for Publishing

When ready to publish, update [package.json](package.json):

1. **Remove or set `private: false`**
   ```json
   "private": false,
   ```

2. **Choose your package name**
   - Keep `@gobrand/tiempo` (requires npm organization)
   - Or rename to `@go-brand/tiempo` or `tiempo-tz`

## Step 4: Publish to npm

### First Time Setup

```bash
# Login to npm
npm login

# If using a scoped package, ensure you have an organization
# Or publish as public
```

### Publish

```bash
# Make sure everything is built
pnpm build

# Dry run to see what will be published
npm publish --dry-run

# Publish for real
npm publish --access public
```

### Automated Publishing (Optional)

To enable automated publishing on version tags:

1. Get an npm token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add it to GitHub Secrets: https://github.com/go-brand/tiempo/settings/secrets/actions
   - Name: `NPM_TOKEN`
   - Value: Your npm token

3. Uncomment the publish step in [.github/workflows/ci.yml](.github/workflows/ci.yml)

4. Create and push a version tag:
   ```bash
   npm version patch  # or minor/major
   git push --follow-tags
   ```

## Step 5: Create a Landing Page

For the landing page, you can:

1. **Use GitHub Pages**
   - Create a `docs/` folder with an `index.html`
   - Enable GitHub Pages in repository settings
   - Point to the `docs/` folder

2. **Use a separate site**
   - Vercel, Netlify, or Cloudflare Pages
   - Create a simple marketing site
   - Link to the GitHub repo and npm package

3. **Use VitePress or Docusaurus**
   - Great for documentation sites
   - Can include interactive examples

## Step 6: Promote Your Package

1. **Add badges to README** (already done ✓)
2. **Tweet about it** - Share on social media
3. **Write a blog post** - Explain why you built it
4. **Submit to awesome lists** - e.g., awesome-temporal
5. **Share on Reddit** - r/javascript, r/typescript
6. **Share on Hacker News** - Show HN: tiempo

## Repository Structure

```
tiempo/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI
├── src/
│   ├── index.ts            # Main source code
│   ├── index.test.ts       # Tests
│   └── temporal.d.ts       # Type definitions
├── dist/                   # Build output (gitignored)
├── .gitignore
├── .npmrc
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm test            # Run tests
pnpm test --watch    # Watch mode
pnpm typecheck       # Type check
pnpm build           # Build the package

# Maintenance
pnpm clean           # Clean build artifacts
```

## Next Steps

1. ✓ Repository is ready and pushed to GitHub
2. ⏳ Wait for CI to pass
3. ⏳ Decide on final package name
4. ⏳ Publish to npm
5. ⏳ Create landing page
6. ⏳ Announce to the world!

## Questions?

Open an issue on GitHub: https://github.com/go-brand/tiempo/issues
