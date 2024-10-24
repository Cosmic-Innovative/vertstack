<div align="center">
<img src="public/vertstack.svg" alt="VERT Stack Logo" width="100" height="100">

# The VERT Stack

A web application development stack, prepared for a wide range of production scenarios.

#

</div>

- **V**ite for fast development and building
- **E**SLint for code quality and consistency
- **R**eact for building user interfaces
- **T**ypeScript for type safety

## Features

- ⚡️ Vite for lightning fast development and building
- 🔷 TypeScript for enhanced type safety and developer experience
- ⚛️ React 18 for building interactive UIs
- 🗣️ Robust internationalization support with dynamic language switching and SEO optimization
- 🧹 ESLint with custom configuration for strict code quality control
- 💖 Prettier for code formatting
- 🐕 Husky for Git hooks
- 🚫 lint-staged for running linters on Git staged files
- 🧪 Vitest for fast and efficient testing
- 🛡️ Error Boundaries for graceful error handling in production
- 🚀 Advanced performance optimization with dynamic imports and granular code splitting
- 🌍 Environment-specific configuration support for development, staging, and production
- 🧭 React Router for seamless navigation between pages
- 🌐 Fetch API integration for efficient data fetching
- 🔒 Enhanced security measures and best practices with comprehensive security event logging
- ♿ Comprehensive accessibility features with WCAG 2.1 compliance
- 📱 Progressive Web App (PWA) support for enhanced mobile experience
- 🔍 Enhanced multilingual SEO with dynamic meta tags, structured data, and Open Graph support
- 🏗️ Enhanced CI/CD setup with GitHub Actions, including Lighthouse CI for automated performance and quality checks
- 📊 Production-grade logging system with performance tracking and offline resilience
- 🐛 Advanced debugging capabilities with type-safe error tracking, request/response tracing and performance threshold monitoring

## Project Structure

```
vert-stack-template/
│
├── .github/
│   └── workflows/
│       ├── pr_checks.yml
│       ├── deploy.yml
│       └── lighthouse.yml
│
├── .husky/
│   └── pre-commit
│
├── public/
│   ├── vertstack.svg
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
│
├── src/
│   ├── components/
│   │   ├── About.tsx
│   │   ├── ApiExample.tsx
│   │   ├── ApiExample.test.tsx
│   │   ├── Contact.tsx
│   │   ├── Contact.test.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Home.tsx
│   │   ├── Home.test.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── LanguageSwitcher.test.tsx
│   │   ├── Navbar.tsx
│   │   ├── TitleComponent.tsx
│   │   ├── UserList.tsx
│   │   └── UserList.test.tsx
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── Navbar.css
│   │   └── LanguageSwitcher.css
│   │
│   ├── utils/
│   │   ├── api.ts
│   │   ├── i18n-datetime-utils.ts
│   │   ├── i18n-number-utils.ts
│   │   ├── i18n-utils.ts
│   │   ├── languageDetection.ts
│   │   ├── logger.ts
│   │   └── sitemapGenerator.ts
│   │
│   ├── locales/
│   │   ├── en.json
│   │   └── es.json
│   │
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── i18n.ts
│   ├── i18n.test.tsx
│   ├── main.tsx
│   ├── pwa.ts
│   └── vite-env.d.ts
│
├── .env
├── .env.development
├── .env.production
├── .env.staging
├── .gitignore
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── lighthouserc.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json
├── tsconfig.eslint.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.setup.ts
```

### Key Directories and Files

- `/.github/workflows/`: Contains GitHub Actions workflow files for CI/CD.
  - `pr_checks.yml`: Defines checks to run on pull requests, including linting, type checking, testing, and building.
  - `deploy.yml`: Defines the deployment process for different environments.
  - `lighthouse.yml`: Runs Lighthouse CI for performance, accessibility, best practices, SEO, and PWA audits.
- `/.husky/`: Contains Git hooks for the project.
  - `pre-commit`: Script that runs before each commit to ensure code quality.
- `/public/`: Stores static assets that are publicly accessible, including PWA icons.
  - `vertstack.svg`: The VERT Stack logo, used as a favicon.
- `/src/`: The main source directory for the application code.
  - `/components/`: React components used in the application.
  - `/styles/`: Styles used in the application.
    - `index.css`: Global styles for the application.
    - `Navbar.css`: Styles specific to the Navbar component.
    - `LanguageSwitcher.css`: Styles for the language switcher component.
  - `/utils/`: Utility functions and helpers.
    - `api.ts`: Contains functions for making API calls.
    - `i18n-datetime-utils.ts`: Locale-specific date and time formatting.
    - `i18n-number-utils.ts`: Locale-specific number, currency, percentages, and pluralization rules.
    - `i18n-utils.ts`: Provides a consistent API for internationalization features.
    - `languageDetection.ts`: Utility for detecting user's preferred language.
    - `logger.ts`: A centralized application-wide logging system.
    - `sitemapGenerator.ts`: Function to generate dynamic sitemap.
  - `/locales/`: Contains language files for internationalization.
    - `en.json`: English translations.
    - `es.json`: Spanish translations.
  - `App.tsx`: The main application component with routing setup.
  - `App.test.tsx`: Tests for the main App component.
  - `i18n.ts`: Internationalization setup and configuration.
  - `i18n.test.tsx`: Tests for internationalization functionality.
  - `main.tsx`: The entry point of the application.
  - `pwa.ts`: Progressive Web App registration and setup.
  - `vite-env.d.ts`: TypeScript declaration file for Vite-specific types and environment variables.
- `.env`: Default environment variables.
- `.env.development`: Environment variables for development.
- `.env.production`: Environment variables for production.
- `.env.staging`: Environment variables for staging.
- `.gitignore`: Specifies files and directories that Git should ignore.
- `.prettierrc.json`: Configuration file for Prettier code formatter.
- `eslint.config.js`: Configuration file for ESLint.
- `index.html`: The main HTML file for the VERT stack application.
- `lighthouserc.json`: Configuration file for Lighthouse CI.
- `package.json`: Project metadata and dependencies.
- `pnpm-lock.yaml`: Lock file for pnpm dependencies.
- `README.md`: Project documentation and overview (this file).
- `CONTRIBUTING.md`: Guidelines for contributing to the project.
- `tsconfig.json`: Main TypeScript configuration for the project.
- `tsconfig.node.json`: TypeScript configuration for Node.js environment.
- `vite.config.ts`: Configuration file for Vite.
- `vitest.setup.ts`: Setup file for Vitest testing framework.

## Getting Started

While easily customizable, the VERT stack is opinionated. Use pnpm.

1. Clone this repository
2. Run `pnpm install` to install dependencies
3. Run `pnpm dev` to start the development server

## Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the project for production
- `pnpm preview`: Preview the production build
- `pnpm lint`: Run ESLint
- `pnpm lint:fix`: Run ESLint and automatically fix issues
- `pnpm format`: Run Prettier to format all files
- `pnpm prepare`: Install Husky git hooks (runs automatically after install)
- `pnpm test`: Run Vitest tests
- `pnpm test:watch`: Run Vitest in watch mode
- `pnpm test:coverage`: Run Vitest with coverage report
- `pnpm test:related`: Run Vitest related to quickly check if changes have broken any related tests
- `pnpm lighthouse`: Run Lighthouse CI locally to check performance, accessibility, best practices, SEO, and PWA audits

## PWA Support

This template includes Progressive Web App (PWA) support, allowing users to install the app on their devices and use it offline.

### PWA Features:

- Installable on desktop and mobile devices
- Offline functionality
- App-like experience

### Developing with PWA:

- The `vite-plugin-pwa` handles service worker generation and PWA asset management.
- Modify the PWA configuration in `vite.config.ts` to customize icons, colors, and other PWA properties.
- Test offline functionality by disabling network in DevTools and refreshing the page.

Remember to rebuild and redeploy your app after making changes to PWA configuration.

### Local Development with HTTPS (Required to test PWA locally)

For local development with HTTPS:

1. Generate local certificates:

   ```bash
   mkcert -install
   mkdir .cert
   mkcert -key-file ./.cert/localhost-key.pem -cert-file ./.cert/localhost.pem localhost
   ```

2. The `vite.config.ts` file is set up to use these certificates if they exist. If the certificates are not found (e.g., in CI environments), the server will run without HTTPS.

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open https://localhost:5173 in your browser. You may need to accept the self-signed certificate.

Note: The HTTPS setup is only for local development. In production, HTTPS should be handled by your hosting provider.

## Routing and API Integration

This template comes pre-configured with React Router for navigation and a simple API integration setup.

### Routing

Routing is set up in the `App.tsx` file using React Router. Here's a basic overview of the route structure:

- `/`: Home page
- `/about`: About page
- `/contact`: Contact page

To add new routes, modify the `App.tsx` file. For example:

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewComponent from './components/NewComponent';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/new-route" element={<NewComponent />} />
      </Routes>
    </Router>
  );
}
```

### API Integration

A basic API utility is provided in `src/utils/api.ts`. It uses the Fetch API to make HTTP requests. Here's how to use it:

```typescript
import { fetchData } from '../utils/api';

// In a component or effect
try {
  const data = await fetchData<YourDataType>('https://api.example.com/data');
  // Handle the data
} catch (error) {
  // Handle any errors
}
```

This utility provides error handling and type safety. Modify the `api.ts` file to add more specific API methods as needed for your project.

Remember to update your environment files (`.env.*`) with the appropriate API URLs for each environment.

## Internationalization

The VERT Stack Template includes comprehensive internationalization support.

### Key Features

- Support for multiple languages (currently English and Spanish)
- Dynamic language switching with the LanguageSwitcher component
- Route-based language selection (e.g., /en/about, /es/about)
- Lazy loading of language resources for improved performance
- Automatic language detection based on user's browser settings

### Adding a New Language

1. Create a new JSON file in the `src/locales` directory (e.g., `fr.json` for French)
2. Add translations for all keys present in `en.json`
3. Update the `supportedLanguages` array in `src/i18n.ts`
4. Add the new language option to the LanguageSwitcher component in `src/components/LanguageSwitcher.tsx`

### Using Translations in Components

To use translations in your components, import the `useTranslation` hook from react-i18next:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('myComponent.title')}</h1>;
}
```

### Number Formatting

```typescript
import { formatNumber, formatCurrency, formatPercentage } from '../utils/i18n';

// Format numbers
formatNumber(1234.56, 'en-US'); // "1,234.56"
formatNumber(1234.56, 'es'); // "1.234,56"

// Format currency
formatCurrency(1234.56, 'en-US', 'USD'); // "$1,234.56"
formatCurrency(1234.56, 'es', 'EUR'); // "1.234,56 €"
```

### Date and Time Formatting

```typescript
import { formatDate, formatRelativeTime } from '../utils/i18n';

formatDate(new Date(), 'en-US');
formatRelativeTime(pastDate, 'es');
```

### List Formatting

```typescript
import { formatList } from '../utils/i18n';

formatList(['apple', 'banana', 'orange'], 'en-US');
// "apple, banana, and orange"
```

### SEO Considerations

- The `TitleComponent` in `src/App.tsx` handles dynamic page titles and meta descriptions for different languages
- Alternate language links are automatically generated for each page
- Structured data (JSON-LD) is included for better search engine understanding

For more detailed information on using and extending the internationalization features, please refer to the [react-i18next documentation](https://react.i18next.com/).

## SEO

The template includes several SEO optimizations:

- Dynamic page titles and meta descriptions based on routes and current language
- Open Graph and Twitter Card meta tags for improved social media sharing
- Structured data (JSON-LD) for rich snippets in search results
- Proper use of semantic HTML elements for better accessibility and SEO

To customize SEO settings for a specific page:

1. Update the `getTitle` function in the `TitleComponent` in `src/App.tsx`
2. Modify the meta tags and structured data as needed for your specific content

## Performance Optimization

- Code splitting for language resources
- Lazy loading of images and components
- Preloading of critical assets

## Accessibility

The template includes various accessibility enhancements, including:

- Proper heading structure
- ARIA labels
- Keyboard navigation support
- High contrast mode support

## Security

- Enhanced Content Security Policy (CSP)
- Implementation of additional HTTP security headers
- Input sanitization to prevent XSS attacks

## Error Handling and Logging

- Robust error boundary system with fallback UI

## Advanced Logging

The VERT Stack includes a comprehensive, type-safe logging system designed for production applications. It features structured logging, performance tracking, and robust error handling with offline capabilities.

### Basic Logging

```typescript
import { logger } from '../utils/logger';

// Simple logging
logger.info('Application started');

// Structured logging with details
logger.info('User action', {
  userId: 123,
  action: 'login',
  category: 'Authentication',
});

// Error logging
try {
  // ... some operation
} catch (error) {
  logger.error('Operation failed', {
    error,
    category: 'Database',
    operation: 'insert',
  });
}
```

## Testing

The template uses Vitest for testing. It's compatible with Jest's API, making it easy to migrate existing tests. Our testing strategy includes:

1. **Unit Tests**: For testing individual components and functions in isolation.
2. **Integration Tests**: For testing how different parts of the application work together, such as routing and internationalization.

with a goal of >80% test coverage.

### When to Write Tests

In our development workflow, we aim to write tests:

1. **During Feature Development**: Tests are written alongside the feature implementation, usually after the basic functionality is in place but before considering the feature complete.
2. **For Bug Fixes**: When fixing a bug, we first write a test that reproduces the bug, then fix the code to make the test pass.
3. **For Refactoring**: Before refactoring, we ensure good test coverage to catch any regressions.

### Running Tests

To run the test suite:

```bash
pnpm test
```

To run tests in watch mode during development:

```bash
pnpm test:watch
```

To generate a coverage report:

```bash
pnpm test:coverage
```

To check related tests:

```bash
pnpm test:related
```

### Test File Location

Test files are located next to the files they are testing with a `.test.ts` or `.test.tsx` extension. This makes it easy to find tests and maintains a clear relationship between test and source files.

### Continuous Integration

Our CI pipeline runs all tests for every pull request and push to the main branch, ensuring that all changes pass our test suite before being merged or deployed.

## Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting. The configuration is set up in `eslint.config.js` and `.prettierrc.json` respectively.

To run the linter:

```bash
pnpm lint
```

To automatically fix linting issues:

```bash
pnpm lint:fix
```

To format code with Prettier:

```bash
pnpm format
```

## Git Hooks

This project uses Husky to manage Git hooks. The pre-commit hook runs lint-staged, which in turn runs ESLint and Prettier on staged files.

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. The workflow is designed to be flexible, supporting setups ranging from a simple production-only environment to a full development-staging-production pipeline.

### Workflow Files

The GitHub Actions workflow files can be found in the `.github/workflows/` directory:

- `pr_checks.yml`: Runs checks on all pull requests
- `deploy.yml`: Handles deployment to all environments
- `lighthouse.yml`: Runs Lighthouse CI for performance, accessibility, best practices, SEO, and PWA audits

### Lighthouse CI

The project includes Lighthouse CI integration, which automatically runs performance, accessibility, best practices, SEO, and PWA audits on each pull request and push to main branches. This helps maintain high standards of web quality and catch potential issues early in the development process.

Key features of our Lighthouse CI setup:

- Runs on desktop preset (mobile audits planned for future implementation)
- Sets performance budgets for key metrics
- Fails the CI process if critical thresholds are not met
- Provides detailed reports for each run, allowing tracking of improvements over time

The Lighthouse CI configuration can be found in the `lighthouserc.json` file in the project root.

### Workflow Overview

On Pull Request to any branch (`pr_checks.yml`):

1. Install dependencies
2. Run linter
3. Perform type checking
4. Run tests
5. Build the project (to ensure it compiles successfully)
6. Run Lighthouse CI
   - Performs audits for performance, accessibility, best practices, SEO, and PWA features
   - Checks against defined thresholds in `lighthouserc.json`
   - Uploads results to temporary public storage for easy viewing

On Push to main, development, or staging branches (`deploy.yml`):

1. Install dependencies
2. Determine the target environment based on the branch
3. Run linter
4. Run tests
5. Build the project using the appropriate .env file
6. Run Lighthouse CI
   - Performs audits as described above
   - Ensures the production build meets quality standards before deployment
7. Deploy to the corresponding environment
8. Run health checks

Lighthouse CI (`lighthouse.yml`):

1. Triggered on push to main and develop branches, and on pull requests to these branches
2. Builds the project
3. Runs Lighthouse audits against the built files
4. Compares results against defined thresholds
5. Uploads detailed reports for each run

This workflow ensures that all code changes are thoroughly checked for quality, performance, and best practices before they are merged or deployed.

### Environment-Specific Considerations

The workflow automatically detects which environment to deploy to based on the branch:

- main branch deploys to production
- staging branch deploys to staging (if used)
- development branch deploys to development (if used)

Each environment can have its own set of secrets and environment variables configured in GitHub Actions.
Sensitive information like API keys and database credentials should be stored as GitHub Secrets and injected during the build process.

### Flexible Environment Setup

This CI/CD configuration is designed to be flexible:

- For a simple setup, you can use just the main branch for production deployments.
- For a more complex setup, you can use all three branches: development, staging, and main (production).
- You can easily add or remove environments by modifying the deploy.yml file and adding or removing the corresponding .env files.

### Deployment Strategy

Deployments are automatic upon push to their respective branches.
For added safety, especially in production, consider adding a manual approval step by modifying the deploy.yml workflow.

### Monitoring and Rollback

The deploy.yml workflow includes a placeholder for health checks after deployment.
Implement proper health checks and rollback procedures based on your specific application and infrastructure.

To use this setup:

1. Ensure your repository has the necessary secrets set up in GitHub Actions.
2. Modify the deploy.yml file to include your actual deployment steps.
3. Implement proper health checks for your application.
4. Optionally, add manual approval steps for sensitive environments like production.

For detailed information on the CI/CD setup, please refer to the workflow files in the .github/workflows/ directory.

## Environment Configuration

This project uses a branch-based environment strategy, coupled with environment-specific configuration files for both local development and deployed environments.

### Branch-Environment Relationship

- `development` branch → Development domain (e.g., dev.yourapp.com)
- `staging` branch → Staging domain (e.g., staging.yourapp.com)
- `main` or `production` branch → Production domain (e.g., yourapp.com)

### Environment Files

1. Local Development:

   - `.env`: Shared default settings (committed to git)
   - `.env.local`: Personal overrides (not committed to git)

2. Deployed Environments:
   - `.env.development`: Settings for the development domain
   - `.env.staging`: Settings for the staging domain
   - `.env.production`: Settings for the production domain

These files should be committed to the repository but should not contain any sensitive information like API keys or passwords.

### File Loading Priority

For local development:

1. `.env.local` (highest priority, not committed to git)
2. `.env` (committed to git)

For deployed environments:

1. `.env.{environment}` (e.g., `.env.development` for the development domain)
2. `.env` (fallback for any values not specified in the environment-specific file)

### Usage in Code

To use environment variables in your application, prefix them with `VITE_`. For example:

```
VITE_API_URL=https://api.example.com
```

You can then access this in your React components:

```typescript
console.log(import.meta.env.VITE_API_URL);
```

Note: Only variables prefixed with `VITE_` are exposed to your React application for security reasons.

### Local Development

For local development, you typically don't need to specify a mode. Simply run:

```
pnpm dev
```

This will use the `.env` file, with any values in `.env.local` taking precedence.

### Deployment

The appropriate environment file will be used based on the branch being deployed:

- When deploying the `development` branch, `.env.development` will be used.
- When deploying the `staging` branch, `.env.staging` will be used.
- When deploying the `main` or `production` branch, `.env.production` will be used.

Ensure your CI/CD pipeline is configured to use the correct environment file based on the branch being deployed.

### Running Lighthouse Locally

To run Lighthouse audits locally before pushing your changes or creating a pull request, use the following command:

```bash
pnpm lighthouse
```

This will build your project and run Lighthouse CI against the built files. It uses the same configuration as the CI process (`lighthouserc.json`), allowing you to catch and fix any issues before pushing your code.

Note: Make sure you have a production build of your application when running this command, as Lighthouse should be run against optimized, production-ready code for the most accurate results.

## Sitemap Generation

This template includes a basic client-side sitemap generation utility. While this approach works for simple, static websites, it has limitations:

1. It doesn't automatically update when you add new pages or change your site structure.
2. It may not be suitable for large, dynamic websites.

For production applications, especially those with dynamic content, it's recommended to implement server-side sitemap generation. This ensures that your sitemap always reflects the current state of your website and can handle larger sites more efficiently.

If you decide to implement server-side sitemap generation, you'll need to:

1. Create a server-side script to generate the sitemap.
2. Set up a route on your server to serve the generated sitemap.
3. Update your robots.txt file to point to the new sitemap location.

Remember to adjust the sitemap generation logic to match your specific needs and site structure.

## Future Considerations

The VERT Stack Template aims to be a solid foundation for modern web applications. To make the most of it:

- Stay updated with the latest versions of the core technologies (Vite, React, TypeScript)
- Regularly review and update dependencies
- Keep an eye on emerging best practices in web development

## Next Steps

After setting up your project with the VERT Stack Template, consider the following:

1. Review and customize the ESLint and Prettier configurations to match your team's coding standards
2. Set up your preferred state management solution if needed (e.g., Redux, MobX, Recoil)
3. Implement your authentication and authorization system
4. Configure your production deployment pipeline

This template is a starting point. Modify and extend it to best suit your project's specific requirements.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License.

## Known Issues

### React Helmet Async Warnings

When building the project, you may see warnings related to react-helmet-async:

```
node_modules/.pnpm/react-helmet-async@1.3.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-helmet-async/lib/index.module.js (1:7186): A comment "/*#__PURE__*/" contains an annotation that Rollup cannot interpret due to the position of the comment. The comment will be removed to avoid issues.
```

These warnings are coming from the react-helmet-async library and do not affect the functionality of your application. They indicate that the library might not be fully optimized for our build process. We're monitoring this issue and will update the template if a solution becomes available.
