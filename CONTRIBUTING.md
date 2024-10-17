# Contributing to VERT Stack Template

First off, thank you for considering contributing to the VERT Stack Template! It's people like you that make it such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Provide specific examples to demonstrate the steps.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible.
- Follow the JavaScript and TypeScript styleguides.
- End all files with a newline
- Avoid platform-dependent code

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

### TypeScript Styleguide

All TypeScript must adhere to [TypeScript Standard Style](https://github.com/standard/ts-standard).

## Internationalization Guidelines

When contributing to the internationalization (i18n) features of the VERT Stack Template, please follow these guidelines:

1. Use the `useTranslation` hook from react-i18next for accessing translations in components.
2. Add new translation keys to all language files in the `src/locales` directory.
3. Use meaningful and hierarchical keys for translations (e.g., `home.title`, `about.description`).
4. Avoid hardcoding text in components. Instead, use translation keys.
5. When adding new features, ensure they support multiple languages from the start.
6. Test your changes with all supported languages to ensure proper rendering and functionality.

### Adding a New Language

To add support for a new language:

1. Create a new JSON file in `src/locales` (e.g., `fr.json` for French).
2. Copy all keys from `en.json` and translate the values to the new language.
3. Update the `supportedLanguages` array in `src/i18n.ts`.
4. Add the new language option to `LanguageSwitcher.tsx`.
5. Update any relevant tests to include the new language.

## Performance and Quality Standards

We use Lighthouse CI to maintain high standards of performance, accessibility, best practices, SEO, and PWA features. Before submitting a pull request, please ensure your changes meet our Lighthouse audit standards.

### Running Lighthouse Locally

To run Lighthouse audits locally:

1. Make sure you have the latest changes and your feature branch is up to date.
2. Build your changes:
   ```
   pnpm build
   ```
3. Run the Lighthouse audit:
   ```
   pnpm lighthouse
   ```

This command will run Lighthouse CI against your built files, using the same configuration as our CI process.

4. Review the results in the console output. Pay special attention to any failed audits or metrics that don't meet our thresholds.
5. Make necessary improvements to address any issues flagged by Lighthouse.
6. Re-run the Lighthouse audit to confirm your changes have resolved the issues.

### Lighthouse Thresholds

Our current Lighthouse score thresholds are:

- Performance: 90
- Accessibility: 90
- Best Practices: 90
- SEO: 90
- PWA: 90

While we strive for high scores in all categories, accessibility is particularly important. Pull requests that lower the accessibility score below 90 will not be accepted without a compelling reason and a plan to address the issues.

### Note on Mobile Audits

Currently, our Lighthouse CI is configured to run desktop audits. However, we plan to implement mobile audits in the future. When working on responsive features, please consider how your changes might impact mobile performance and usability.

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `chore` - Quick updates and maintenance.
- `feature` - Feature requests.
- `bug` - Issues that are bugs.
- `enhancement` - Issues related to feature requests.
- `docs` - Issues or pull requests related to documentation.

Thank you for contributing!
