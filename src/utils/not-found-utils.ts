import { logger } from './logger';

interface NotFoundEvent {
  path: string;
  referrer: string | null;
  userAgent: string;
  timestamp: string;
  language: string;
}

export const trackNotFound = (language: string): void => {
  const event: NotFoundEvent = {
    path: window.location.pathname,
    referrer: document.referrer || null,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    language,
  };

  // Log the 404 event
  logger.warn('404 Page Not Found', {
    category: 'Navigation',
    event,
    metadata: {
      path: event.path,
      referrer: event.referrer,
    },
  });

  // If using analytics, track the event
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: '404 Not Found',
      page_path: event.path,
      page_referrer: event.referrer,
    });
  }

  // Add to performance metrics
  if (window.performance && window.performance.mark) {
    window.performance.mark('404-encountered');
  }
};
