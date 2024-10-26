import React, { useEffect, useRef } from 'react';
import {
  initMobilePerformanceTracking,
  reportMobileVitals,
} from '../utils/performance-utils';

interface OptimizedHeroImageProps {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const OptimizedHeroImage: React.FC<OptimizedHeroImageProps> = ({
  desktopSrc,
  mobileSrc,
  alt,
  className = '',
  priority = false,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Only initialize tracking if this is a priority (LCP) image
    if (priority) {
      initMobilePerformanceTracking();
      reportMobileVitals();
    }
  }, [priority]);

  // Preload the image if it's priority
  useEffect(() => {
    if (priority && desktopSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = desktopSrc;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [desktopSrc, priority]);

  return (
    <picture>
      {mobileSrc && (
        <source
          media="(max-width: 768px)"
          srcSet={mobileSrc}
          type="image/svg+xml"
        />
      )}
      <img
        ref={imgRef}
        src={desktopSrc}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        width="100%"
        height="auto"
        style={{
          aspectRatio: '16/9',
          objectFit: 'contain',
        }}
      />
    </picture>
  );
};

export default OptimizedHeroImage;
