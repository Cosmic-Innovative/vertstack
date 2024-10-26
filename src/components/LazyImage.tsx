import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string;
  height?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = imgRef.current;
          if (img) {
            // Set explicit dimensions before loading
            if (width) img.style.width = `${width}px`;
            if (height) img.style.height = `${height}px`;

            img.src = src;
            setIsLoaded(true);
            observer.unobserve(img);
          }
        }
      },
      { rootMargin: '100px' },
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [src, width, height]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      width={width}
      height={height}
      // Use an SVG or small base64 placeholder
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
      style={{
        // Prevent layout shift by maintaining aspect ratio
        aspectRatio: width && height ? `${width} / ${height}` : 'auto',
        // Ensure smooth transitions
        transition: 'opacity 0.3s ease',
        opacity: isLoaded ? 1 : 0,
        // Prevent layout shift during loading
        objectFit: 'contain',
        backgroundColor: '#f3f4f6',
      }}
    />
  );
};

export default LazyImage;
