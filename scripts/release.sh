#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if version type is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Version type required${NC}"
  echo ""
  echo "Usage: pnpm release <patch|minor|major>"
  echo ""
  echo "Examples:"
  echo "  pnpm release patch  # Bug fixes, docs (0.1.0 -> 0.1.1)"
  echo "  pnpm release minor  # New features (0.1.0 -> 0.2.0)"
  echo "  pnpm release major  # Breaking changes (0.1.0 -> 1.0.0)"
  exit 1
fi

VERSION_TYPE=$1

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Error: Invalid version type '$VERSION_TYPE'${NC}"
  echo "Must be one of: patch, minor, major"
  exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}Error: You have uncommitted changes${NC}"
  echo "Please commit or stash your changes first"
  git status -s
  exit 1
fi

# Make sure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${YELLOW}Warning: You are on branch '$CURRENT_BRANCH', not 'main'${NC}"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo -e "${GREEN}Starting release process...${NC}"

# Run tests
echo "Running tests..."
pnpm test

# Run type check
echo "Running type check..."
pnpm typecheck

# Build
echo "Building..."
pnpm build

# Bump version
echo "Bumping version ($VERSION_TYPE)..."
NEW_VERSION=$(npm version $VERSION_TYPE -m "chore: release v%s")

echo -e "${GREEN}Version bumped to $NEW_VERSION${NC}"

# Push with tags
echo "Pushing to GitHub..."
git push --follow-tags

echo ""
echo -e "${GREEN}✓ Release complete!${NC}"
echo ""
echo "GitHub Actions will now:"
echo "  1. Run tests"
echo "  2. Build the package"
echo "  3. Publish to npm"
echo ""
echo "Check progress at:"
echo "  https://github.com/go-brand/tiempo/actions"
echo ""
echo "Once published, it will be available at:"
echo "  https://www.npmjs.com/package/@gobrand/tiempo"
