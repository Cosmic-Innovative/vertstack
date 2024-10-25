import { logger } from './logger';

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface NetworkInformation {
  effectiveType: string;
  saveData: boolean;
  rtt: number;
  downlink: number;
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
  connection?: NetworkInformation;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  duration: number;
  interactionId: number;
  target?: Node;
}

export function initMobilePerformanceTracking(): void {
  // Track First Contentful Paint (FCP)
  const fcpObserver = new PerformanceObserver((entryList) => {
    const fcpEntry = entryList.getEntries()[0];
    logger.info('First Contentful Paint (FCP)', {
      category: 'Performance',
      value: fcpEntry.startTime,
      metric: 'FCP',
    });
  });
  fcpObserver.observe({ entryTypes: ['paint'] });

  // Track Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    logger.info('Largest Contentful Paint (LCP)', {
      category: 'Performance',
      value: lastEntry.startTime,
      metric: 'LCP',
    });
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Track First Input Delay (FID)
  const fidObserver = new PerformanceObserver((entryList) => {
    const firstInput = entryList.getEntries()[0] as PerformanceEventTiming;
    logger.info('First Input Delay (FID)', {
      category: 'Performance',
      value: firstInput.processingStart - firstInput.startTime,
      metric: 'FID',
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Track Cumulative Layout Shift (CLS)
  let clsValue = 0;
  let clsEntries: LayoutShift[] = [];

  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries() as LayoutShift[]) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    }

    logger.info('Cumulative Layout Shift (CLS)', {
      category: 'Performance',
      value: clsValue,
      metric: 'CLS',
    });
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Track Time to First Byte (TTFB)
  const navigationObserver = new PerformanceObserver((entryList) => {
    const navEntry = entryList.getEntries()[0] as PerformanceNavigationTiming;
    const ttfb = navEntry.responseStart - navEntry.requestStart;

    logger.info('Time to First Byte (TTFB)', {
      category: 'Performance',
      value: ttfb,
      metric: 'TTFB',
    });
  });
  navigationObserver.observe({ entryTypes: ['navigation'] });

  // Track long tasks
  const longTaskObserver = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry) => {
      logger.warn('Long Task Detected', {
        category: 'Performance',
        duration: entry.duration,
        startTime: entry.startTime,
        metric: 'LongTask',
      });
    });
  });
  longTaskObserver.observe({ entryTypes: ['longtask'] });

  // Disconnect observers when page is unloaded
  window.addEventListener('unload', () => {
    fcpObserver.disconnect();
    lcpObserver.disconnect();
    fidObserver.disconnect();
    clsObserver.disconnect();
    navigationObserver.disconnect();
    longTaskObserver.disconnect();
  });
}

// Add to main.tsx
export function reportMobileVitals(): void {
  const navigator = window.navigator as NavigatorWithMemory;

  if (navigator.connection) {
    const connection = navigator.connection;
    logger.info('Network Information', {
      category: 'Performance',
      effectiveType: connection.effectiveType,
      saveData: connection.saveData,
      rtt: connection.rtt,
      downlink: connection.downlink,
    });
  }

  if (navigator.deviceMemory) {
    logger.info('Device Memory', {
      category: 'Performance',
      deviceMemory: navigator.deviceMemory,
    });
  }
}
