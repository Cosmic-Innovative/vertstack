import React, { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { logger } from '../utils/logger';

interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<unknown>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isDetailsExpanded: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private lastFocusedElement: HTMLElement | null = null;
  private errorBoundaryRef = React.createRef<HTMLDivElement>();
  private detailsRef = React.createRef<HTMLDivElement>();
  private retryButtonRef = React.createRef<HTMLButtonElement>();

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isDetailsExpanded: false,
  };

  public static getDerivedStateFromProps(
    props: Props,
    state: State,
  ): Partial<State> | null {
    if (state.hasError && props.resetKeys) {
      return {
        hasError: false,
        error: null,
        errorInfo: null,
        isDetailsExpanded: false,
      };
    }
    return null;
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Store last focused element for restoration
    this.lastFocusedElement = document.activeElement as HTMLElement;

    // Enhanced error logging
    logger.error('Uncaught error in component', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      location: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    this.setState({ errorInfo }, () => {
      // Move focus to error boundary after state update
      setTimeout(() => {
        if (this.errorBoundaryRef.current) {
          this.errorBoundaryRef.current.focus();
        }
      }, 0);
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public componentWillUnmount(): void {
    // Restore focus when unmounting
    if (this.lastFocusedElement && 'focus' in this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }

  private handleDetailsToggle = (): void => {
    const isExpanded = !this.state.isDetailsExpanded;
    this.setState({ isDetailsExpanded: isExpanded }, () => {
      if (isExpanded && this.detailsRef.current) {
        const firstFocusable = this.detailsRef.current.querySelector(
          'button, [tabindex]',
        ) as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    });
  };

  private handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape' && this.state.isDetailsExpanded) {
      event.preventDefault();
      this.setState({ isDetailsExpanded: false });
      if (this.retryButtonRef.current) {
        this.retryButtonRef.current.focus();
      }
      return;
    }

    // Add the focus trap logic directly here since we removed handleFocusTrap
    if (this.state.isDetailsExpanded && event.key === 'Tab') {
      const details = this.detailsRef.current;
      if (!details) return;

      const focusableElements = details.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  private handleRetry = (): void => {
    this.setState(
      {
        hasError: false,
        error: null,
        errorInfo: null,
        isDetailsExpanded: false,
      },
      () => {
        // Restore focus to last focused element before error
        if (this.lastFocusedElement && 'focus' in this.lastFocusedElement) {
          this.lastFocusedElement.focus();
        }
      },
    );
  };

  public render(): ReactNode {
    const { t, fallback, children } = this.props;
    const { hasError, error, errorInfo, isDetailsExpanded } = this.state;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div
          ref={this.errorBoundaryRef}
          className="error-boundary"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          tabIndex={-1}
        >
          <div className="error-content">
            <h2 className="error-title">{t('errors.boundary.title')}</h2>
            <p className="error-message">{t('errors.boundary.message')}</p>

            <div
              ref={this.detailsRef}
              className="error-details"
              role="presentation" // Change from region to presentation
            >
              <button
                onClick={this.handleDetailsToggle}
                onKeyDown={this.handleKeyDown}
                aria-expanded={isDetailsExpanded}
                aria-controls="error-details-content"
                className="details-toggle"
              >
                {t('errors.boundary.showDetails')}
              </button>

              {isDetailsExpanded && (
                <div
                  id="error-details-content"
                  className="error-details-content"
                  role="region"
                  aria-labelledby="error-details-heading"
                >
                  <h3 id="error-details-heading">
                    {t('errors.boundary.errorInfo')}
                  </h3>
                  <p className="error-text">{error?.message}</p>
                  {errorInfo && (
                    <pre className="error-stack">
                      <code>{errorInfo.componentStack}</code>
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div
              className="error-actions"
              role="group"
              aria-label={t('errors.boundary.actions')}
            >
              <button
                ref={this.retryButtonRef}
                onClick={this.handleRetry}
                className="retry-button"
                aria-label={t('errors.boundary.retryLabel')}
              >
                {t('errors.boundary.retry')}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="refresh-button"
                aria-label={t('errors.boundary.refreshLabel')}
              >
                {t('errors.boundary.refresh')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default withTranslation()(ErrorBoundary as React.ComponentType<Props>);
