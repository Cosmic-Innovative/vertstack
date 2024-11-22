# Performance Monitoring

## Overview

The VERT Stack implements performance monitoring through custom hooks, web vitals tracking, and structured logging, providing comprehensive insights into application performance.

## Performance Hooks

### Core Metrics

```typescript
const usePerformanceMetric = (
  metricName: string,
  warningThreshold?: number,
): {
  startMetric: () => void;
  endMetric: () => void;
  metrics: MetricSummary;
} => {
  const { current: metricId } = useRef(`${metricName}-${Date.now()}`);

  const startMetric = useCallback(() => {
    logger.startMetric(metricId);
  }, [metricId]);

  const endMetric = useCallback(() => {
    logger.endMetric(metricId, warningThreshold);
  }, [metricId, warningThreshold]);

  return {
    startMetric,
    endMetric,
    metrics: logger.getMetricsSummary(metricName),
  };
};

const useResourceTiming = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        logger.info('Resource Timing', {
          category: 'Performance',
          name: resource.name,
          duration: resource.duration,
          size: resource.decodedBodySize,
          type: resource.initiatorType,
        });
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    return () => observer.disconnect();
  }, []);
};
```

### User Experience Monitoring

```typescript
const useLongTaskDetection = (threshold = 50) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        logger.warn('Long Task Detected', {
          category: 'Performance',
          duration: entry.duration,
          startTime: entry.startTime,
          metric: 'LongTask',
        });
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    return () => observer.disconnect();
  }, [threshold]);
};

const useTouchResponseTracking = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: PerformanceEventTiming) => {
        if (entry.duration > 100) {
          logger.warn('Slow Touch Response', {
            category: 'Performance',
            duration: entry.duration,
            type: entry.name,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['event'] });
    return () => observer.disconnect();
  }, []);
};

const useLayoutShiftTracking = () => {
  const [cls, setCls] = useState(0);

  useEffect(() => {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShift[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setCls(clsValue);
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    return () => observer.disconnect();
  }, []);

  return cls;
};
```

### API Performance

```typescript
const useApiPerformance = () => {
  return async (url: string, options: RequestInit) => {
    const { startMetric, endMetric } = usePerformanceMetric('api-request');

    startMetric();
    try {
      const response = await fetch(url, options);
      endMetric();
      return response;
    } catch (error) {
      endMetric();
      logger.error('API Request Failed', {
        category: 'Performance',
        url,
        error,
      });
      throw error;
    }
  };
};
```

## Web Vitals Implementation

```typescript
export function initMobilePerformanceTracking(): void {
  const fcpObserver = new PerformanceObserver((entryList) => {
    const fcpEntry = entryList.getEntries()[0];
    logger.info('First Contentful Paint (FCP)', {
      category: 'Performance',
      value: fcpEntry.startTime,
      metric: 'FCP',
    });
  });
  fcpObserver.observe({ entryTypes: ['paint'] });

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
}

export function reportMobileVitals(): void {
  const navigator = window.navigator as NavigatorWithMemory;

  if (navigator.connection) {
    logger.info('Network Information', {
      category: 'Performance',
      effectiveType: connection.effectiveType,
      saveData: connection.saveData,
      rtt: connection.rtt,
      downlink: connection.downlink,
    });
  }
}
```

## Layout Stability Components

### Image Loading

```typescript
const StableImage: React.FC<{
  src: string;
  alt: string;
  width: number;
  height: number;
}> = ({ src, alt, width, height }) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = imgRef.current;
          if (img) {
            img.src = src;
            setIsLoading(false);
          }
        }
      },
      { rootMargin: '50px' },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div style={{ width, height }} className="relative overflow-hidden">
      <img
        ref={imgRef}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
```

### Content Loading

```typescript
const ContentSection: React.FC<{ content?: string }> = ({ content }) => (
  <div className="min-h-[200px] p-4">
    {content || (
      <div className="animate-pulse h-full w-full bg-gray-200 rounded" />
    )}
  </div>
);

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
    </form>
  );
};
```

## Usage Examples

### Component Performance Monitoring

```typescript
const MonitoredComponent = () => {
  const { startMetric, endMetric } = usePerformanceMetric('component-render');
  useResourceTiming();
  useLongTaskDetection();
  useLayoutShiftTracking();
  useTouchResponseTracking();

  useEffect(() => {
    startMetric();
    return () => endMetric();
  }, []);

  return <div>Monitored Content</div>;
};
```

### API Performance Tracking

```typescript
const DataComponent = () => {
  const performanceApi = useApiPerformance();

  const fetchData = async () => {
    try {
      const response = await performanceApi('/api/data', {
        method: 'GET',
      });
      return response.json();
    } catch (error) {
      // Error handling
    }
  };

  return <div>Data Component</div>;
};
```

## Testing

```typescript
describe('Performance Hooks', () => {
  it('tracks metrics correctly', () => {
    const { result } = renderHook(() => usePerformanceMetric('test-metric'));

    act(() => {
      result.current.startMetric();
      result.current.endMetric();
    });

    expect(result.current.metrics).toHaveProperty('average');
  });

  it('tracks layout shifts', async () => {
    const { result } = renderHook(() => useLayoutShiftTracking());
    const entry = new PerformanceEntry();
    entry.entryType = 'layout-shift';
    entry.value = 0.1;

    const observer = PerformanceObserver.getInstance();
    observer.callback([entry]);

    expect(result.current).toBeGreaterThan(0);
  });
});
```

## Related Documentation

- [Performance Architecture](../architecture/performance.md)
- [Component Patterns](../architecture/component-patterns.md)
- [Bundle Analysis](../development/bundle-analysis.md)
