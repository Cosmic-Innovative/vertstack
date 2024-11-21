# Getting Started with VERT Stack

Welcome to VERT Stack! This guide will help you get up and running quickly and introduce you to the key concepts and features of the stack.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** - Version 18.x or later
- **pnpm** - Version 8.x or later (VERT Stack uses pnpm exclusively)
- **Modern web browser** - For development and testing
- **Code editor** - We recommend VS Code with our recommended extensions
- **Git** - For version control

## Quick Start

```bash
# Create new project
git clone https://github.com/your-org/vert-stack-template my-project
cd my-project

# Install dependencies
pnpm install

# Start development
pnpm dev
```

Visit `http://localhost:5173` to see your app running.

## Next Steps

1. **[Installation Guide](installation.md)**

   - Detailed setup instructions
   - Environment configuration
   - Development tools setup

2. **[Project Structure](project-structure.md)**

   - Directory organization
   - Key files and folders
   - Configuration files

3. **[Core Features](../core-features/README.md)**

   - Error handling
   - Performance monitoring
   - Internationalization
   - PWA support

4. **[Development Guide](../development/README.md)**
   - Code style guidelines
   - Testing practices
   - Development workflow
   - Best practices

## Common Tasks

### Development

```bash
# Start development server
pnpm dev

# Start with HTTPS (for PWA development)
pnpm dev:https

# Run tests
pnpm test

# Lint and format code
pnpm lint
pnpm format
```

### Building

```bash
# Production build
pnpm build

# Preview production build
pnpm preview

# Analyze bundle
ANALYZE=true pnpm build
```

## Getting Help

- 📖 Review our [documentation](../README.md)
- 🐛 Report issues on our [issue tracker](https://github.com/your-org/vert-stack/issues)
- 💬 Join our [discussions](https://github.com/your-org/vert-stack/discussions)
- 🔍 Check the [troubleshooting guide](project-structure.md#troubleshooting)

## What's Next?

- Explore our [installation guide](installation.md) for detailed setup instructions
- Learn about our [project structure](project-structure.md)
- Read about our [core features](../core-features/README.md)
- Join our [community](../development/contributing.md)
