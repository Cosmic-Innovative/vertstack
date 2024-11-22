# Contributing to VERT Stack

## Overview

Thank you for considering contributing to the VERT Stack! This guide will help you understand our contribution process and standards.

## Quick Start

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/vert-stack-app
cd vert-stack-app

# Install dependencies
pnpm install

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and run tests
pnpm test:related
pnpm lint:fix

# Submit a pull request
```

## Development Process

### 1. Setting Up Your Environment

```bash
# Install dependencies
pnpm install

# Set up git hooks
pnpm prepare

# Verify your setup
pnpm dev
pnpm test
```

### 2. Making Changes

1. **Code Style**

   - Follow our [Code Style Guide](./code-style.md)
   - Use TypeScript for all new code
   - Include proper types and documentation
   - Run formatters before committing:
     ```bash
     pnpm format
     pnpm lint:fix
     ```

2. **Testing Requirements**

   - Write tests for all new features
   - Follow our [Testing Guidelines](./testing-guidelines.md)
   - Maintain or improve coverage:
     ```bash
     pnpm test:coverage
     ```

3. **Documentation**
   - Update documentation for changes
   - Follow the [Documentation Tools Guide](./documentation-tools.md)
   - Update metadata:
     ```bash
     pnpm docs-metadata update-status <section> <file> <status> <owner>
     ```

### 3. Commit Messages

Follow conventional commits for clear history:

```
feat: add new feature
^--^  ^------------^
|     |
|     +-> Summary in present tense
|
+-------> Type: feat, fix, docs, style, refactor, test, chore
```

**Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Updates to build process, dependencies, etc.

**Examples:**

```bash
feat: add language switcher component
fix: resolve hydration error in ErrorBoundary
docs: update installation instructions
test: add tests for API utilities
```

### 4. Pull Request Process

1. **Before Submitting**

   ```bash
   # Run all checks
   pnpm lint
   pnpm test
   pnpm type-check
   pnpm build
   ```

2. **PR Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Checklist

   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] Types properly defined
   - [ ] All tests passing
   - [ ] Lint checks passing
   ```

3. **Review Process**
   - Address review comments promptly
   - Keep PRs focused and atomic
   - Update based on feedback

## Code Quality Standards

### 1. TypeScript Requirements

```typescript
// DO: Use proper typing
interface ComponentProps {
  title: string;
  onAction: (id: string) => Promise<void>;
}

// DON'T: Use any or implicit types
const Component = (props: any) => { ... }
```

### 2. Testing Standards

```typescript
// DO: Write comprehensive tests
describe('Component', () => {
  it('renders with proper document structure', async () => {
    await render(<Component />, { route: '/en' });
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles internationalization', async () => {
    const { changeLanguage } = await render(<Component />, { route: '/en' });
    await changeLanguage('es');
    // Verify Spanish content
  });
});
```

### 3. Documentation Requirements

````typescript
/**
 * A component that displays user information.
 *
 * @example
 * ```tsx
 * <UserInfo userId="123" showDetails={true} />
 * ```
 *
 * @param props - Component props
 * @param props.userId - User identifier
 * @param props.showDetails - Whether to show detailed information
 */
const UserInfo: React.FC<UserInfoProps> = ({ userId, showDetails }) => {
  // Implementation
};
````

## Feature Development

### 1. Planning

- Discuss major changes in issues first
- Get consensus on implementation approach
- Consider internationalization early
- Plan for accessibility

### 2. Implementation

1. **Component Development**

   ```typescript
   // Follow component patterns
   const NewFeature: React.FC<NewFeatureProps> = ({ prop }) => {
     const { t } = useTranslation('namespace');
     const [isLoading, setIsLoading] = useState(true);

     // Include proper loading states
     if (isLoading) {
       return <LoadingState />;
     }

     return (
       <article role="main" aria-labelledby="title">
         {/* Implementation */}
       </article>
     );
   };
   ```

2. **Error Handling**

   ```typescript
   try {
     const data = await fetchData<ResponseType>(endpoint);
   } catch (error) {
     logger.error('Operation failed', {
       error,
       context: 'NewFeature',
     });
   }
   ```

3. **Accessibility**
   ```typescript
   // Include proper ARIA attributes
   <button
     aria-label={t('accessibility.action')}
     aria-expanded={isOpen}
     onClick={handleAction}
   >
     {children}
   </button>
   ```

### 3. Testing

```typescript
// Include all necessary test cases
describe('NewFeature', () => {
  it('renders correctly', async () => {});
  it('handles user interactions', async () => {});
  it('manages loading states', async () => {});
  it('handles errors gracefully', async () => {});
  it('supports internationalization', async () => {});
});
```

## Release Process

1. **Version Updates**

   ```bash
   # Update version
   pnpm version patch|minor|major
   ```

2. **Change Documentation**

   ```markdown
   # Changelog entry

   ## [1.2.0] - 2024-11-14

   ### Added

   - New feature description

   ### Fixed

   - Bug fix description
   ```

3. **Release Process**
   - Create release branch
   - Update documentation
   - Submit release PR

## Getting Help

- File an issue for bugs
- Use discussions for questions
- Join our community channels
- Check existing documentation

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Follow project guidelines

This contribution guide is a living document. We welcome suggestions for improvements!

## Additional Resources

- [Project Structure](../getting-started/project-structure.md)
- [Development Guide](../development/README.md)
- [Testing Guide](./testing-guidelines.md)
- [Documentation Tools](./documentation-tools.md)
