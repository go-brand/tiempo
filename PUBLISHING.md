# Publishing Guide

This repository uses automated publishing via GitHub Actions. Here's how it works.

## One-Time Setup

The `publish` job in `.github/workflows/ci.yml` uses npm trusted publishing: GitHub Actions gives the job an OIDC token, and npm exchanges it for a short-lived publish token. There is no npm token in GitHub Secrets, so nothing expires. npm also attaches a provenance attestation to each release.

### 1. Add a trusted publisher on npmjs.com

1. Go to https://www.npmjs.com/package/@gobrand/tiempo/access (package **Settings**) and find **Trusted publishing**.
2. Choose **GitHub Actions** and fill in exactly (all fields are case-sensitive):
   - Organization or user: `go-brand`
   - Repository: `tiempo`
   - Workflow filename: `ci.yml` (filename only, not the path)
   - Environment name: leave empty
3. Under **Allowed actions**, select **npm publish**. New configurations allow only `npm stage publish` by default, and the workflow runs `npm publish`.
4. Save. npm does not check the configuration when you save it; mistakes show up only when the workflow publishes.

A new configuration expires if it has not completed a successful publish within 2 days. Add it shortly before you run `pnpm release`. If it expires, delete it and add it again.

### 2. Lock down token publishing (after the first successful release)

Once a release has published through the workflow:

1. In the package's **Settings → Publishing access**, select "Require two-factor authentication and disallow tokens" and save. Trusted publishing keeps working; it does not use tokens.
2. Delete the `NPM_TOKEN` secret at https://github.com/go-brand/tiempo/settings/secrets/actions and revoke the token at https://www.npmjs.com/settings/~/tokens.

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
   - Publish to npm through trusted publishing, with provenance

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

### `ENEEDAUTH`, `E404 PUT`, or "Unable to authenticate" in the publish job
npm rejected the OIDC exchange. Check, on the package's Trusted publishing settings:
- The configuration exists and has not expired (it must publish within 2 days of creation)
- Organization `go-brand`, repository `tiempo`, workflow filename `ci.yml`, no environment
- **npm publish** is an allowed action

Also check that the `publish` job still has `id-token: write` and runs on a GitHub-hosted runner, and that `repository.url` in `package.json` is `https://github.com/go-brand/tiempo.git`. After fixing the settings, re-run the failed `publish` job from the Actions page; the tag is already pushed.

### "Tests failed" during release
- Fix the failing tests first
- Commit the fixes
- Try the release again

### "Uncommitted changes" error
- Commit all your changes first with `git commit`
- Then run the release command

### Manual publish (emergency only)
If GitHub Actions is down and you need to publish manually, publish from your machine with your own npm account and 2FA:

```bash
# Log in interactively (2FA)
npm login

# Bump version manually
npm version patch  # or minor/major

# Build
pnpm build

# Publish (npm asks for a one-time password)
npm publish --access public

# Push the version tag
git push --follow-tags
```
