# Contributing to tiempo

Thank you for your interest in contributing to tiempo! We welcome contributions from the community.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/go-brand/tiempo.git
   cd tiempo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run tests**
   ```bash
   pnpm test
   ```

4. **Build the project**
   ```bash
   pnpm build
   ```

## Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write tests for new features
   - Ensure all tests pass: `pnpm test`
   - Ensure types are correct: `pnpm typecheck`
   - Ensure the build works: `pnpm build`

3. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `test:` - Test additions or changes
   - `chore:` - Maintenance tasks

4. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Use TypeScript
- Follow the existing code style
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

- Write tests for all new features
- Ensure existing tests pass
- Aim for high test coverage

## Questions?

Feel free to open an issue if you have any questions!
