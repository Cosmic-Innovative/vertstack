# Development Guide

## Overview

Comprehensive guide for developing with the VERT Stack.

## Key Tools & Guidelines

### [Code Style](code-style.md)

- TypeScript guidelines
- React patterns
- ESLint configuration
- Formatting standards

### [Testing Guidelines](testing-guidelines.md)

- Testing principles
- Component testing
- Integration testing
- Coverage requirements

### [Contributing](contributing.md)

- Development workflow
- Pull request process
- Code review guidelines
- Quality standards

### [Bundle Analysis](bundle-analysis.md)

- Bundle composition
- Size analysis
- Performance tracking
- Optimization strategies

### [Documentation Tools](documentation-tools.md)

- Documentation management
- Status tracking
- Verification process
- Best practices

### [Build Configuration](build-configuration.md)

- Vite configuration
- Build optimization
- Security settings
- Asset handling

## Available Scripts

### Development

- `pnpm dev`: Start development server
- `pnpm dev:http`: Start HTTP server
- `pnpm dev:https`: Start HTTPS server (for PWA testing)
- `pnpm preview`: Preview production build

### Building

- `pnpm build`: Build for production
- `pnpm type-check`: Run TypeScript type checking

### Quality Checks

- `pnpm lint`: Run ESLint
- `pnpm lint:fix`: Fix linting issues
- `pnpm format`: Format code with Prettier

### Testing

- `pnpm test`: Run all tests
- `pnpm test:watch`: Run tests in watch mode
- `pnpm test:coverage`: Generate coverage report
- `pnpm test:related`: Run tests related to changed files

### Performance

- `pnpm lighthouse`: Run Lighthouse CI checks

## Related Documentation

- [Project Structure](../getting-started/project-structure.md)
- [Core Features](../core-features/README.md)
- [Architecture](../architecture/README.md)
