import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));
const Contact = React.lazy(() => import('./components/Contact'));
const ApiExample = React.lazy(() => import('./components/ApiExample'));

const supportedLanguages = ['en', 'es']; // Add more languages as needed

export const LanguageRoute: React.FC<{ component: React.ComponentType }> = ({
  component: Component,
}) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    if (lang && supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!lang || !supportedLanguages.includes(lang)) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

  return <Component />;
};

export const TitleComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const getTitle = () => {
    const path = pathname.split('/')[2] || ''; // Adjust for language prefix
    switch (path) {
      case '':
        return t('home.title');
      case 'about':
        return t('about.title');
      case 'contact':
        return t('contact.title');
      case 'api-example':
        return t('apiExample.title');
      default:
        return 'VERT Stack Template';
    }
  };

  const title = getTitle();
  const description = t('home.description');
  const url = `https://example.com${pathname}`;

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{title} - VERT Stack Template</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://example.com/og-image.jpg" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta
        property="twitter:image"
        content="https://example.com/twitter-image.jpg"
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'VERT Stack Template',
          url: 'https://example.com',
          description: description,
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://example.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        })}
      </script>
    </Helmet>
  );
};

const AppContent: React.FC = () => (
  <>
    <TitleComponent />
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <Navbar />
    <main id="main-content" className="container">
      <Suspense fallback={<div aria-live="polite">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/:lang" element={<LanguageRoute component={Home} />} />
          <Route
            path="/:lang/about"
            element={<LanguageRoute component={About} />}
          />
          <Route
            path="/:lang/contact"
            element={<LanguageRoute component={Contact} />}
          />
          <Route
            path="/:lang/api-example"
            element={<LanguageRoute component={ApiExample} />}
          />
        </Routes>
      </Suspense>
    </main>
  </>
);

interface AppProps {
  useRouter?: boolean;
}

const App: React.FC<AppProps> = ({ useRouter = true }) => {
  const content = (
    <HelmetProvider>
      <ErrorBoundary
        fallback={
          <div role="alert">
            Something went wrong. Please try refreshing the page.
          </div>
        }
      >
        <AppContent />
      </ErrorBoundary>
    </HelmetProvider>
  );

  return useRouter ? <Router>{content}</Router> : content;
};

export default App;
