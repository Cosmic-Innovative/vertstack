import { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { logger } from '../utils/logger';

interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', { error, errorInfo });
  }

  public render() {
    const { t, fallback } = this.props;

    if (this.state.hasError) {
      if (fallback) {
        return fallback;
      }
      return (
        <div className="error-boundary">
          <h1>{t('errors.somethingWentWrong')}</h1>
          <p>{t('errors.errorBoundaryMessage')}</p>
          {this.state.error && (
            <details>
              <summary>{t('errors.errorDetails')}</summary>
              <pre>{this.state.error.toString()}</pre>
            </details>
          )}
          <button onClick={() => window.location.reload()}>
            {t('errors.refreshPage')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
