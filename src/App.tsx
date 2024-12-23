import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import TitleComponent from './components/TitleComponent';
import Footer from './components/Footer';

// Lazy load route components for better performance
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const ApiExample = lazy(() => import('./components/ApiExample'));
const I18nExamples = lazy(() => import('./components/I18nExamples'));
const TermsOfService = lazy(() => import('./components/Legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./components/Legal/PrivacyPolicy'));
const NotFound = lazy(() => import('./components/NotFound'));

// List of supported languages
const supportedLanguages = ['en', 'es'];

interface LanguageRouteProps {
  component: React.ComponentType;
  useRouter: boolean;
}

const LanguageRoute: React.FC<LanguageRouteProps> = ({
  component: Component,
  useRouter,
}) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  // Change language based on route parameter
  React.useEffect(() => {
    if (useRouter && lang && supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n, useRouter]);

  // Redirect to default language if no language is specified in the URL
  if (!useRouter || !lang || !supportedLanguages.includes(lang)) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

  return <Component />;
};

interface AppContentProps {
  useRouter: boolean;
}

const AppContent: React.FC<AppContentProps> = React.memo(({ useRouter }) => {
  const { t, i18n } = useTranslation();
  const params = useParams<{ lang: string }>();
  const lang = useRouter ? params.lang : i18n.language;

  React.useEffect(() => {
    if (useRouter && lang && supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n, useRouter]);

  const routeElements = useRouter ? (
    <>
      <Route
        path="/"
        element={<LanguageRoute component={Home} useRouter={useRouter} />}
      />
      <Route
        path="/about"
        element={<LanguageRoute component={About} useRouter={useRouter} />}
      />
      <Route
        path="/contact"
        element={<LanguageRoute component={Contact} useRouter={useRouter} />}
      />
      <Route
        path="/api-example"
        element={<LanguageRoute component={ApiExample} useRouter={useRouter} />}
      />
      <Route
        path="/i18n-examples"
        element={
          <LanguageRoute component={I18nExamples} useRouter={useRouter} />
        }
      />
      <Route
        path="/terms"
        element={
          <LanguageRoute component={TermsOfService} useRouter={useRouter} />
        }
      />
      <Route
        path="/privacy"
        element={
          <LanguageRoute component={PrivacyPolicy} useRouter={useRouter} />
        }
      />
      <Route
        path="*"
        element={<LanguageRoute component={NotFound} useRouter={useRouter} />}
      />
    </>
  ) : (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/api-example" element={<ApiExample />} />
      <Route path="/i18n-examples" element={<I18nExamples />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </>
  );

  return (
    <>
      <TitleComponent />
      <a href="#main-content" className="skip-to-main">
        {t('general.skipToContent')}
      </a>
      <Navbar />
      <div className="app-wrapper">
        <main id="main-content" className="container" role="main">
          <Suspense
            fallback={
              <div className="loading-container" aria-live="polite">
                {t('general.loading')}
              </div>
            }
          >
            <Routes>{routeElements}</Routes>
          </Suspense>
        </main>
      </div>
      <Footer />
    </>
  );
});

AppContent.displayName = 'AppContent';

interface AppProps {
  useRouter?: boolean;
}

const App: React.FC<AppProps> = ({ useRouter = true }) => {
  const { t } = useTranslation();

  const errorFallback = (
    <div role="alert">{t('errors.somethingWentWrong')}</div>
  );

  const content = (
    <HelmetProvider>
      <ErrorBoundary fallback={errorFallback}>
        {useRouter ? (
          <Routes>
            {/* Route for language-prefixed paths */}
            <Route path="/:lang/*" element={<AppContent useRouter={true} />} />
            {/* Redirect root to default language */}
            <Route path="/" element={<Navigate to="/en" replace />} />
          </Routes>
        ) : (
          <AppContent useRouter={false} />
        )}
      </ErrorBoundary>
    </HelmetProvider>
  );

  if (useRouter) {
    return <Router>{content}</Router>;
  }

  return content;
};

export default App;
