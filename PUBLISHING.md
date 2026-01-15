# Publishing Guide

This repository uses automated publishing via GitHub Actions. Here's how it works.

## One-Time Setup

### 1. Add NPM Token to GitHub Secrets

1. Get your npm token from: https://www.npmjs.com/settings/~/tokens
   - Use the granular access token you created earlier with "Bypass 2FA" enabled
   - Or create a new one if needed

2. Add it to GitHub Secrets:
   - Go to: https://github.com/go-brand/tiempo/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token (starts with `npm_...`)
   - Click "Add secret"

That's it! You only need to do this once.

## Publishing a New Version

### Quick Reference

```bash
# Bug fixes, docs, typos
pnpm release patch    # 0.1.0 → 0.1.1

# New features (backwards compatible)
pnpm release minor    # 0.1.0 → 0.2.0

# Breaking changes
pnpm release major    # 0.1.0 → 1.0.0
```

### Detailed Steps

1. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push
   ```

2. **Run the release command**:
   ```bash
   # For a bug fix or documentation update:
   pnpm release patch

   # For a new feature:
   pnpm release minor

   # For a breaking change:
   pnpm release major
   ```

3. **That's it!** The script will:
   - Run tests
   - Run type check
   - Build the package
   - Bump the version in package.json
   - Create a git tag
   - Push to GitHub with the tag

4. **GitHub Actions will**:
   - Run all tests again
   - Build the package
   - Automatically publish to npm

5. **Monitor progress**:
   - Check: https://github.com/go-brand/tiempo/actions
   - Once complete, verify: https://www.npmjs.com/package/@gobrand/tiempo

## What is Semantic Versioning?

Version format: `MAJOR.MINOR.PATCH`

### PATCH (0.1.0 → 0.1.1)
**When:** Bug fixes, documentation updates, typos, internal refactoring
**Why:** No impact on users - everything still works exactly the same

Examples:
- Fix typo in README
- Fix incorrect TypeScript type
- Update documentation
- Optimize internal code without changing behavior

### MINOR (0.1.0 → 0.2.0)
**When:** New features, but backwards compatible
**Why:** Users can upgrade safely - old code still works, new features available

Examples:
- Add new function `formatZonedTime()`
- Add new optional parameter to existing function
- Export additional types
- Add new utility function

### MAJOR (0.1.0 → 1.0.0)
**When:** Breaking changes - users must update their code
**Why:** Signals to users they need to read changelog and update their code

Examples:
- Remove a function
- Rename a function
- Change function signature (required parameters)
- Change return type in incompatible way
- Change behavior in non-backwards compatible way

## Troubleshooting

### "NPM_TOKEN not found" error in GitHub Actions
- Make sure you added the NPM token to GitHub Secrets
- The secret name must be exactly `NPM_TOKEN`

### "Tests failed" during release
- Fix the failing tests first
- Commit the fixes
- Try the release again

### "Uncommitted changes" error
- Commit all your changes first with `git commit`
- Then run the release command

### Manual publish (emergency only)
If GitHub Actions is down and you need to publish manually:

```bash
# Make sure you're logged in with a token that has "Bypass 2FA"
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN

# Bump version manually
npm version patch  # or minor/major

# Build
pnpm build

# Publish
npm publish --access public

# Push the version tag
git push --follow-tags
```
