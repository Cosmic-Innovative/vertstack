import { render, screen, fireEvent, act } from '@testing-library/react';
import React, { Component } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';
import { logger } from '../utils/logger';

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  withTranslation:
    () => (Component: React.ComponentType<{ t: (key: string) => string }>) => {
      const MockedComponent = (props: { t?: (key: string) => string }) => {
        return <Component t={(key: string) => key} {...props} />;
      };
      MockedComponent.displayName = `WithTranslation(${
        Component.displayName || Component.name || 'Component'
      })`;
      return MockedComponent;
    },
}));

// Test component that throws error
class ThrowError extends Component<{ shouldThrow?: boolean }> {
  render() {
    if (this.props.shouldThrow !== false) {
      throw new Error('Test error');
    }
    return <div>Normal render</div>;
  }
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Normal render')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('errors.boundary.title')).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalledWith(
      'Uncaught error in component',
      expect.objectContaining({
        error: expect.any(Error),
        errorInfo: expect.any(Object),
        location: expect.any(String),
        timestamp: expect.any(String),
        userAgent: expect.any(String),
      }),
    );
  });

  it('manages focus correctly when error occurs', async () => {
    const focusTarget = document.createElement('button');
    focusTarget.textContent = 'Focus me first';
    document.body.appendChild(focusTarget);
    focusTarget.focus();

    await act(async () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );
    });

    // Wait a tick for the focus to be updated
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const errorBoundary = screen.getByRole('alert');
    expect(document.activeElement).toBe(errorBoundary);

    // Cleanup
    document.body.removeChild(focusTarget);
  });

  it('handles keyboard navigation within error details', async () => {
    await act(async () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );
    });

    // Open the details section
    const details = screen.getByRole('button', {
      name: 'errors.boundary.showDetails',
    });

    await act(async () => {
      fireEvent.click(details);
      // Let the details expand
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify the details are expanded
    expect(details).toHaveAttribute('aria-expanded', 'true');

    // Verify that escape closes the details
    await act(async () => {
      fireEvent.keyDown(details, { key: 'Escape' });
    });
    expect(details).toHaveAttribute('aria-expanded', 'false');

    // Re-open details for more tests
    await act(async () => {
      fireEvent.click(details);
    });

    // Verify all interactive elements are present and focusable
    const interactiveElements = [
      screen.getByRole('button', { name: 'errors.boundary.showDetails' }),
      screen.getByRole('button', { name: 'errors.boundary.retryLabel' }),
      screen.getByRole('button', { name: 'errors.boundary.refreshLabel' }),
    ];

    // Verify each element is focusable
    for (const element of interactiveElements) {
      element.focus();
      expect(document.activeElement).toBe(element);
    }
  });

  it('handles Escape key to close details', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const summary = screen.getByRole('button', {
      name: 'errors.boundary.showDetails',
    });

    // Open details
    fireEvent.click(summary);

    // Press Escape
    fireEvent.keyDown(summary, { key: 'Escape' });

    // Details should be closed
    expect(summary.getAttribute('aria-expanded')).toBe('false');
  });

  it('restores focus when error is cleared', async () => {
    const { container } = render(
      <>
        <button>Initial focus</button>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </>,
    );

    const initialButton = container.querySelector('button');
    if (initialButton) {
      initialButton.focus();
    }

    const retryButton = screen.getByRole('button', {
      name: 'errors.boundary.retryLabel',
    });

    // Click retry
    fireEvent.click(retryButton);

    // Focus should return to initial button
    expect(document.activeElement).toBe(initialButton);
  });

  // Existing tests remain unchanged
  it('uses custom fallback when provided', () => {
    const fallback = <div>Custom fallback</div>;
    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('calls onError prop when error occurs', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });

  it('resets when resetKeys change', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={[1]}>
        <div>Original content</div>
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary resetKeys={[2]}>
        <div>New content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('New content')).toBeInTheDocument();
  });
});
