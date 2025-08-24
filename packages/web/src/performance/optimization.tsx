import React from 'react';

/**
 * Performance optimization utilities for AccessibleOS
 */

// Lazy loading utility
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Image optimization
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  if (hasError) {
    return (
      <div
        className={`image-placeholder ${className || ''}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span>Image failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={`${className || ''} ${isLoaded ? 'loaded' : 'loading'}`}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        transition: 'opacity 0.3s ease',
        opacity: isLoaded ? 1 : 0.7,
      }}
    />
  );
};

// Debounce hook
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling for large lists
export interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      style={{
        height: containerHeight,
        overflow: 'auto',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Memoization utilities
export const memoizeOne = <Args extends any[], Return>(
  fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
  let lastArgs: Args | undefined;
  let lastResult: Return;

  return (...args: Args): Return => {
    if (!lastArgs || !areArgsEqual(args, lastArgs)) {
      lastArgs = args;
      lastResult = fn(...args);
    }
    return lastResult;
  };
};

const areArgsEqual = <T extends any[]>(a: T, b: T): boolean => {
  if (a.length !== b.length) return false;
  return a.every((arg, index) => arg === b[index]);
};

// Bundle splitting utilities
export const loadChunk = async (chunkName: string) => {
  try {
    switch (chunkName) {
      case 'analytics':
        return await import('../components/Analytics/Analytics');
      case 'profile':
        return await import('../components/Profile/UserProfile');
      case 'settings':
        return await import('../components/Settings/AccessibilitySettings');
      default:
        throw new Error(`Unknown chunk: ${chunkName}`);
    }
  } catch (error) {
    console.error(`Failed to load chunk ${chunkName}:`, error);
    throw error;
  }
};

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTiming(label: string): () => void {
    const start = performance.now();

    return () => {
      const end = performance.now();
      const duration = end - start;

      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }

      this.metrics.get(label)!.push(duration);

      // Keep only last 100 measurements
      const measurements = this.metrics.get(label)!;
      if (measurements.length > 100) {
        measurements.shift();
      }
    };
  }

  getMetrics(label: string) {
    const measurements = this.metrics.get(label) || [];
    if (measurements.length === 0) return null;

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return { avg, min, max, count: measurements.length };
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    for (const [label] of this.metrics.entries()) {
      result[label] = this.getMetrics(label);
    }
    return result;
  }

  logMetrics() {
    console.table(this.getAllMetrics());
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Resource preloading
export const preloadResource = (href: string, as: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

export const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Web Vitals measurement
export const measureWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
