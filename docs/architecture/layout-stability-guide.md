# VERT Stack Layout Stability Guide

## Core Principles

1. **Reserve Space Early**

   - Always define minimum heights/widths for containers
   - Use skeleton loaders that match final content dimensions
   - Maintain consistent spacing in all states

2. **Handle Loading States**

   - Show skeleton loaders during data fetching
   - Maintain identical layouts between loading/loaded states
   - Use smooth transitions between states

3. **Image Handling**

   - Always specify width and height attributes
   - Use aspect ratio containers
   - Implement proper lazy loading

4. **Font Management**
   - Use font-display: swap
   - Preload critical fonts
   - Define fallback font stacks

## Base Component Template

```tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface BaseComponentProps {
  minHeight?: string;
  className?: string;
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  minHeight = '400px',
  className = '',
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Your data fetching logic here
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  return (
    <div className={`base-component ${className}`} style={{ minHeight }}>
      {/* Header Section - Fixed Height */}
      <header className="h-16 mb-4">
        {isLoading ? (
          <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse" />
        ) : (
          <h1>{t('your.title.key')}</h1>
        )}
      </header>

      {/* Main Content - Minimum Height */}
      <main className="min-h-[200px] mb-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
        ) : (
          <div>{/* Your content here */}</div>
        )}
      </main>

      {/* Footer Section - Fixed Height */}
      <footer className="h-16 mt-auto">
        {isLoading ? (
          <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse" />
        ) : (
          <div>{/* Your footer content here */}</div>
        )}
      </footer>
    </div>
  );
};

export default BaseComponent;
```

## Component-Specific Templates

### Image Grid Template

```tsx
const ImageGridComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array(6)
        .fill(null)
        .map((_, idx) => (
          <div
            key={idx}
            className="relative pt-[100%] bg-gray-100 rounded-lg overflow-hidden"
          >
            {isLoading ? (
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            ) : (
              <img
                src={`/image-${idx}.jpg`}
                alt={`Item ${idx}`}
                className="absolute inset-0 w-full h-full object-cover"
                width="300"
                height="300"
                loading="lazy"
              />
            )}
          </div>
        ))}
    </div>
  );
};
```

### List Template

```tsx
const ListComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-[400px]">
      <ul className="space-y-4">
        {isLoading
          ? Array(5)
              .fill(null)
              .map((_, idx) => (
                <li
                  key={idx}
                  className="h-16 border rounded-lg overflow-hidden"
                >
                  <div className="h-full animate-pulse bg-gray-200" />
                </li>
              ))
          : data.map((item) => (
              <li key={item.id} className="h-16 border rounded-lg p-4">
                {item.content}
              </li>
            ))}
      </ul>
    </div>
  );
};
```

### Form Template

```tsx
const FormComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <form className="space-y-6 min-h-[500px]">
      <div className="form-group h-24">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <label htmlFor="field">Label</label>
            <input type="text" id="field" className="w-full h-10" />
          </>
        )}
      </div>
      {/* Repeat for other form fields */}
    </form>
  );
};
```

## CSS Best Practices

```css
/* Base Container Rules */
.stable-container {
  min-height: var(--min-height, 400px);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

/* Image Containers */
.image-container {
  position: relative;
  overflow: hidden;
  background-color: var(--placeholder-color, #f3f4f6);
}

.image-container::before {
  content: '';
  display: block;
  padding-top: var(--aspect-ratio, 100%);
}

/* Skeleton Loading */
.skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

/* Transitions */
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}
```

## Implementation Checklist

✅ **For Every Component:**

- [ ] Define minimum heights for containers
- [ ] Implement loading states with skeletons
- [ ] Add explicit dimensions for images
- [ ] Use consistent spacing
- [ ] Handle layout for all breakpoints
- [ ] Test with slow network conditions

✅ **For Images:**

- [ ] Add width and height attributes
- [ ] Use aspect ratio containers
- [ ] Implement proper lazy loading
- [ ] Add placeholder backgrounds
- [ ] Handle loading failures gracefully

✅ **For Dynamic Content:**

- [ ] Reserve space before loading
- [ ] Match skeleton dimensions to content
- [ ] Add smooth transitions
- [ ] Handle empty states
- [ ] Test with various content lengths

## Common Pitfalls to Avoid

1. **Don't:**

   - Use auto-height containers for dynamic content
   - Skip loading states
   - Forget mobile layouts
   - Ignore font loading behavior
   - Leave images without dimensions

2. **Instead:**
   - Define minimum heights
   - Always show loading states
   - Test all breakpoints
   - Use font-display: swap
   - Specify image dimensions

## Development Tip

Testing layout stability can be integrated with our existing test suite:

```typescript
describe('Component Layout Stability', () => {
  it('maintains consistent height during loading', () => {
    const { container } = render(<YourComponent />);
    const initialHeight = container.firstChild?.clientHeight;

    // Trigger loading state
    act(() => {
      // Your loading trigger here
    });

    expect(container.firstChild?.clientHeight).toBe(initialHeight);
  });
});
```

## Final Notes

Remember that layout stability is crucial for user experience and SEO. These templates and guidelines should help maintain consistent layout stability across your VERT stack application. Regular testing and monitoring of Cumulative Layout Shift (CLS) metrics will help ensure your implementations remain effective.
