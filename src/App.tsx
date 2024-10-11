import React, { Suspense } from 'react';
import {
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

  return (
    <Helmet>
      <html lang={i18n.language} />
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
        <TitleComponent />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="container">
          <Suspense fallback={<div aria-live="polite">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/en" replace />} />
              <Route
                path="/:lang"
                element={<LanguageRoute component={Home} />}
              />
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
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
