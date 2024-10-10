import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import { useTranslation } from 'react-i18next';

const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));
const Contact = React.lazy(() => import('./components/Contact'));
const ApiExample = React.lazy(() => import('./components/ApiExample'));

const TitleComponent: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return t('home.title');
      case '/about':
        return t('about.title');
      case '/contact':
        return t('contact.title');
      case '/api-example':
        return t('apiExample.title');
      default:
        return 'VERT Stack Template';
    }
  };

  return (
    <Helmet>
      <html lang={navigator.language} />
      <title>{getTitle()} - VERT Stack Template</title>
      <meta name="description" content={t('home.description')} />
    </Helmet>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ErrorBoundary
        fallback={
          <div role="alert">
            Something went wrong. Please try refreshing the page.
          </div>
        }
      >
        <Router>
          <div>
            <TitleComponent />
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="container">
              <Suspense fallback={<div aria-live="polite">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/api-example" element={<ApiExample />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
