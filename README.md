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
- 🏗 TypeScript for enhanced type safety and developer experience
- ⚛️ React 18 for building interactive UIs
- 📏 ESLint for code linting with modern configuration (eslint.config.js)
- 💖 Prettier for code formatting
- 🐶 Husky for Git hooks
- 🚫 lint-staged for running linters on Git staged files
- 🧪 Vitest for fast and efficient testing
- 🛡️ Error Boundaries for graceful error handling in production
- 🚀 Flexible CI/CD pipeline with GitHub Actions, supporting multiple environments
- 🌍 Environment-specific configuration support for development, staging, and production
- 🧭 React Router for seamless navigation between pages
- 🌐 Fetch API integration for efficient data fetching
- 🔒 Enhanced security measures and best practices
- 🚄 Optimized performance with code splitting and lazy loading
- ♿ Comprehensive accessibility features with WCAG 2.1 compliance
- 📱 Progressive Web App (PWA) support for enhanced mobile experience
- 🗣️ Robust internationalization support with easy language switching
- 🔍 Enhanced SEO with dynamic meta tags, structured data, and Open Graph support

## Project Structure

```
vert-stack-template/
│
├── .github/
│   └── workflows/
│       ├── pr_checks.yml
│       └── deploy.yml
│
├── .husky/
│   └── pre-commit
│
├── public/
│   └── vertstack.svg
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
│   │   ├── Navbar.tsx
│   │   ├── UserList.tsx
│   │   └── UserList.test.tsx
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── utils/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── pwa.ts
│   ├── main.tsx
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
  - `pr_checks.yml`: Defines checks to run on pull requests.
  - `deploy.yml`: Defines the deployment process for different environments.
- `/.husky/`: Contains Git hooks for the project.
  - `pre-commit`: Script that runs before each commit to ensure code quality.
- `/public/`: Stores static assets that are publicly accessible.
  - `vertstack.svg`: The Vertstack logo, used as a favicon.
- `/src/`: The main source directory for the application code.
  - `/components/`: React components used in the application.
  - `/styles/`: Styles used in the application.
    - `index.css`: Global styles for the application.
  - `/utils/`: Utility functions, including API handling.
    - `api.ts`: Contains functions for making API calls.
  - `App.tsx`: The main application component with routing setup.
  - `App.test.tsx`: Tests for the main App component.
  - `main.tsx`: The entry point of the application.
  - `vite-env.d.ts`: TypeScript declaration file for Vite-specific types and environment variables. Contains PWA worker registration type definitions to ensure proper TypeScript support for PWA functionality.
- `.env`: Default environment variables.
- `.env.development`: Environment variables for development.
- `.env.production`: Environment variables for production.
- `.env.staging`: Environment variables for staging.
- `.gitignore`: Specifies files and directories that Git should ignore.
- `.prettierrc.json`: Configuration file for Prettier code formatter.
- `eslint.config.js`: Configuration file for ESLint.
- `index.html`: The main HTML file for the Vert stack application.
- `package.json`: Project metadata and dependencies.
- `pnpm-lock.yaml`: Lock file for pnpm dependencies.
- `README.md`: Project documentation and overview.
- `tsconfig.json`: Main TypeScript configuration for the project.
- `tsconfig.eslint.json`: TypeScript configuration specific to ESLint.
- `tsconfig.node.json`: TypeScript configuration for Node.js environment.
- `vite.config.ts`: Configuration file for Vite.
- `vitest.setup.ts`: Setup file for Vitest testing framework.

## Performance Optimization

This template includes several performance optimizations:

1. **Code Splitting**: The application uses React's `lazy` and `Suspense` features to implement code splitting. This means that each route is loaded only when it's needed, reducing the initial bundle size and improving load times.

2. **Lazy Loading**: Route components are lazy-loaded, which means they're only fetched when the user navigates to that route. This improves the initial load time of the application.

3. **Manual Chunk Splitting**: The Vite configuration includes manual chunk splitting for vendor libraries. This helps in better caching and can significantly reduce load times for returning visitors.

4. **Preload Hints**: The `index.html` file includes preload hints for critical resources, allowing the browser to start loading these resources earlier in the page load process.

These optimizations help to improve the overall performance and user experience of the application. Remember to analyze and optimize your specific application as it grows, as performance needs can vary based on the complexity and structure of your project.

## Getting Started

While easily customizable, the vert stack is opinionated. Use pnpm.

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

## PWA Support

This template now includes Progressive Web App (PWA) support, allowing users to install the app on their devices and use it offline.

### PWA Features:

- Installable on desktop and mobile devices
- Offline functionality
- App-like experience

### Developing with PWA:

- The `vite-plugin-pwa` handles service worker generation and PWA asset management.
- Modify the PWA configuration in `vite.config.ts` to customize icons, colors, and other PWA properties.
- Test offline functionality by disabling network in DevTools and refreshing the page.

Remember to rebuild and redeploy your app after making changes to PWA configuration.

### Local Development with HTTPS ( Required to test PWA locally )

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

The VERT Stack Template comes with built-in internationalization support using react-i18next. Here are some key features:

- Support for multiple languages (currently English and Spanish)
- Easy language switching with the LanguageSwitcher component
- Route-based language selection (e.g., /en/about, /es/about)
- Translations for navigation and page titles

To add a new language:

1. Create a new JSON file in the `src/locales` directory (e.g., `fr.json` for French)
2. Add the new language to the `supportedLanguages` array in `src/App.tsx`
3. Update the LanguageSwitcher component in `src/components/LanguageSwitcher.tsx` to include the new language

## SEO

The template includes several SEO optimizations:

- Dynamic page titles and meta descriptions based on routes and current language
- Open Graph and Twitter Card meta tags for improved social media sharing
- Structured data (JSON-LD) for rich snippets in search results
- Proper use of semantic HTML elements for better accessibility and SEO

To customize SEO settings for a specific page:

1. Update the `getTitle` function in the `TitleComponent` in `src/App.tsx`
2. Modify the meta tags and structured data as needed for your specific content

## Testing

This project uses Vitest for testing. Vitest is a Vite-native testing framework that's fast and efficient. It's compatible with Jest's API, making it easy to migrate existing tests.

To run tests:

```bash
pnpm test
```

To run tests in watch mode:

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

### Workflow Overview

On Pull Request to any branch (`pr_checks.yml`):

1. Install dependencies
2. Run linter
3. Run tests
4. Build the project (to ensure it compiles successfully)

On Push to main, development, or staging branches (`deploy.yml`):

1. Install dependencies
2. Determine the target environment based on the branch
3. Run linter
4. Run tests
5. Build the project using the appropriate .env file
6. Deploy to the corresponding environment
7. Run health checks

### Environment-Specific Considerations

The workflow automatically detects which environment to deploy to based on the branch:

main branch deploys to production
staging branch deploys to staging (if used)
development branch deploys to development (if used)

Each environment can have its own set of secrets and environment variables configured in GitHub Actions.
Sensitive information like API keys and database credentials should be stored as GitHub Secrets and injected during the build process.

### Flexible Environment Setup

This CI/CD configuration is designed to be flexible:

For a simple setup, you can use just the main branch for production deployments.
For a more complex setup, you can use all three branches: development, staging, and main (production).
You can easily add or remove environments by modifying the deploy.yml file and adding or removing the corresponding .env files.

### Deployment Strategy

Deployments are automatic upon push to their respective branches.
For added safety, especially in production, consider adding a manual approval step by modifying the deploy.yml workflow.

### Monitoring and Rollback

The deploy.yml workflow includes a placeholder for health checks after deployment.
Implement proper health checks and rollback procedures based on your specific application and infrastructure.

To use this setup:

Ensure your repository has the necessary secrets set up in GitHub Actions.
Modify the deploy.yml file to include your actual deployment steps.
Implement proper health checks for your application.
Optionally, add manual approval steps for sensitive environments like production.

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

## Future Roadmap

The VERT Stack Template includes advanced features that prepare it for a wide range of production scenarios.

While these features address many common production requirements, users should still evaluate the template against their specific project needs, scale, and industry standards. The template provides a robust foundation that's closer to production-ready for many scenarios, but may require further customization for specific use cases or enterprise-level applications.

Prioritized list for getting closer:

1. **PWA Support (if required)**: Implement service workers and add a web app manifest for progressive web app capabilities.
2. **SEO Optimization**: Add React Helmet for basic SEO setup. Important for applications needing to be discoverable through search engines.
3. **Internationalization (i18n) (if required)**: Add support for multiple languages if required for your application.
4. **Expanded Documentation**: Provide more comprehensive documentation on project structure, design decisions, and best practices. Create a landing page site for VERT stack for wider audience and better documentation.

Nice to haves. Will get to them at some point:

- **Authentication and authorization**: Basic authentication system

Feel free to submit a pull request. :)

## How to Proceed from Here

### Adding a UI Component Library

To enhance your development process and ensure UI consistency, you might want to add a UI component library. Here are some popular options:

1. **Ant Design (Recommended)**

   Ant Design is a comprehensive UI library with a wide range of components and built-in support for animations via Ant Motion.

   To add Ant Design to your project:

   ```bash
   pnpm add antd @ant-design/icons
   ```

   To use Ant Motion for animations:

   ```bash
   pnpm add rc-tween-one @ant-design/react-slick
   ```

   [Ant Design Documentation](https://ant.design/)
   [Ant Motion Documentation](https://motion.ant.design/)

2. **Material-UI (MUI)**

   A popular React UI framework implementing Google's Material Design.

   ```bash
   pnpm add @mui/material @emotion/react @emotion/styled
   ```

   [MUI Documentation](https://mui.com/)

3. **Chakra UI**

   A simple, modular, and accessible component library for React applications.

   ```bash
   pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion
   ```

   [Chakra UI Documentation](https://chakra-ui.com/)

After adding your chosen UI library, you may need to set up theme providers or import styles. Refer to the respective documentation for detailed setup instructions.

### Next Steps

1. **Build Something Amazing**: The VERT stack sets you up for success! Take the remaining steps.

2. **Let Us Know About It**: We love seeing what others build! Browse the gallery and add yours.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
