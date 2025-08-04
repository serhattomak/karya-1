/**
 * Performance Optimizations and Best Practices
 * Post-refactoring optimization examples
 */

import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Loading, ErrorMessage } from '../components/common/CommonComponents';

// 1. Lazy Loading for Route Components
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage/ProductDetailPage'));
const AdminLayout = lazy(() => import('../admin/components/AdminLayout/AdminLayout'));

// 2. Error Boundary Wrapper
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <ErrorMessage 
    message={error.message} 
    onRetry={resetErrorBoundary}
  />
);

// 3. High Order Component for Performance Monitoring
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return React.memo((props) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 100) { // Log slow renders
          console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
        }
      };
    });

    return <WrappedComponent {...props} />;
  });
};

// 4. Optimized Route Configuration
export const OptimizedRoutes = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<Loading size="large" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        {/* Other routes */}
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

// 5. Image Optimization Component
export const OptimizedImage = React.memo(({ 
  src, 
  alt, 
  width, 
  height,
  loading = "lazy",
  className = "",
  fallbackSrc = "/assets/images/Group 300.webp"
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageSrc(fallbackSrc);
    setImageLoading(false);
  };

  return (
    <div className={`optimized-image-container ${className}`}>
      {imageLoading && <div className="image-placeholder">Loading...</div>}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
    </div>
  );
});

// 6. Virtual Scrolling for Large Lists (if needed)
export const VirtualizedList = ({ items, renderItem, itemHeight = 100 }) => {
  const [startIndex, setStartIndex] = React.useState(0);
  const [endIndex, setEndIndex] = React.useState(10);
  const containerRef = React.useRef();

  React.useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const containerHeight = containerRef.current.clientHeight;
        
        const newStartIndex = Math.floor(scrollTop / itemHeight);
        const newEndIndex = Math.min(
          items.length - 1,
          newStartIndex + Math.ceil(containerHeight / itemHeight)
        );
        
        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [items.length, itemHeight]);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div 
      ref={containerRef}
      style={{ 
        height: '400px', 
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div style={{ 
          transform: `translateY(${startIndex * itemHeight}px)` 
        }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. Debounced Search Hook
export const useDebouncedSearch = (searchFunction, delay = 300) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchFunction(searchTerm);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchFunction, delay]);

  return { searchTerm, setSearchTerm, results, loading };
};

// 8. Performance Metrics Hook
export const usePerformanceMetrics = (componentName) => {
  React.useEffect(() => {
    const startTime = performance.now();

    // Measure First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            console.log(`${componentName} FCP:`, entry.startTime);
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      
      return () => observer.disconnect();
    }

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Log performance metrics
      console.log(`${componentName} render time:`, renderTime);
    };
  }, [componentName]);
};

// 9. Bundle Size Optimization Tips
const bundleOptimizationTips = `
1. Use React.lazy() for route-based code splitting
2. Import only needed parts from libraries (tree shaking)
3. Use dynamic imports for heavy components
4. Optimize images (WebP format, lazy loading)
5. Remove unused dependencies
6. Use production build for deployment
7. Enable gzip compression on server
8. Use CDN for static assets
9. Implement service worker for caching
10. Monitor bundle size with webpack-bundle-analyzer
`;

export { bundleOptimizationTips };
