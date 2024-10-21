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

## Development Process

1. Fork the repository and create your branch from `main`.
2. Install dependencies with `pnpm install`.
3. Make your changes and ensure the code lints with `pnpm lint`.
4. Run the tests with `pnpm test` and ensure they all pass.
5. If you've added code that should be tested, add tests.
6. If you've changed APIs, update the documentation.
7. Ensure the test coverage is maintained or improved with `pnpm test:coverage`.
8. Make sure your code lints and formatting is correct with `pnpm lint` and `pnpm format`.

## Running Tests

- Run `pnpm test` to run all tests.
- Use `pnpm test:watch` for development to run tests in watch mode.
- Check test coverage with `pnpm test:coverage`.

## Accessibility Guidelines

When contributing, please ensure your changes maintain or improve accessibility:

1. Use semantic HTML elements.
2. Ensure proper ARIA attributes are used where necessary.
3. Maintain keyboard navigation functionality.
4. Ensure color contrast ratios meet WCAG 2.1 AA standards.
5. Test with screen readers if making significant UI changes.

## Performance Considerations

1. Avoid unnecessary re-renders in React components.
2. Use lazy loading for images and components when appropriate.
3. Optimize asset sizes, especially images.
4. Be mindful of bundle size when adding new dependencies.

## Security Best Practices

1. Sanitize all user inputs to prevent XSS attacks.
2. Use HTTPS for all external requests.
3. Avoid storing sensitive information in local storage or cookies.
4. Follow the principle of least privilege in your code.

## Internationalization (i18n)

When adding new text content:

1. Use the `useTranslation` hook from react-i18next.
2. Add new translation keys to all language files in `src/locales`.
3. Use meaningful and hierarchical keys for translations.

Thank you for contributing to the VERT Stack Template!
