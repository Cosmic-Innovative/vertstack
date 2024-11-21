# CI/CD Configuration Guide

## Overview

The VERT Stack uses GitHub Actions for continuous integration and deployment, with three primary workflows:

- Pull request validation
- Environment deployments
- Lighthouse CI checks

## Workflow Files

### PR Checks (`pr_checks.yml`)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run linter
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Run tests
        run: pnpm test

      - name: Build check
        run: pnpm build
```

### Deployment (`deploy.yml`)

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Determine environment
        id: env
        run: |
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "Environment is production"
            echo "environment=production" >> $GITHUB_OUTPUT
          elif [ "${{ github.ref }}" = "refs/heads/staging" ]; then
            echo "Environment is staging"
            echo "environment=staging" >> $GITHUB_OUTPUT
          else
            echo "Environment is development"
            echo "environment=development" >> $GITHUB_OUTPUT
          fi

      - name: Build application
        run: pnpm build
```

### Lighthouse CI (`lighthouse.yml`)

```yaml
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse CI
        run: pnpm lighthouse

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-results
          path: .lighthouseci
```

## Lighthouse CI Configuration

From `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "onlyCategories": [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
          "pwa"
        ]
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "categories:pwa": ["warn", { "minScore": 0.9 }],
        "service-worker": "error",
        "installable-manifest": "error",
        "splash-screen": "warn",
        "themed-omnibox": "warn",
        "content-width": "error",
        "viewport": "error",
        "apple-touch-icon": "warn"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## Local Development CI

Running CI checks locally:

```bash
# Run all checks
pnpm lint
pnpm test
pnpm type-check
pnpm build

# Run Lighthouse CI locally
pnpm lighthouse
```

## Quality Gates

### Pull Request Checks

All PRs must pass:

- Linting (`pnpm lint`)
- Type checking (`pnpm type-check`)
- Tests (`pnpm test`)
- Build verification (`pnpm build`)
- Lighthouse CI thresholds

### Lighthouse Thresholds

Performance requirements:

- Performance: ≥90%
- Accessibility: ≥90%
- Best Practices: ≥90%
- SEO: ≥90%
- PWA: ≥90%

Critical requirements:

- Service worker must be present
- Manifest must be installable
- Viewport must be properly configured
- Content width must be appropriate

## Running Lighthouse Locally

```bash
# Run Lighthouse CI
pnpm lighthouse

# Results will be available in:
# - Terminal output
# - .lighthouseci directory
# - Uploaded to temporary storage (URL provided in output)
```

## Related Documentation

- [Environment Configuration](./environment-configuration.md)
- [Performance Monitoring](../core-features/performance-monitoring.md)
- [PWA Support](../core-features/pwa.md)
