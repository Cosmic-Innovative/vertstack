import React, { Suspense } from 'react';
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

const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));
const Contact = React.lazy(() => import('./components/Contact'));
const ApiExample = React.lazy(() => import('./components/ApiExample'));

const supportedLanguages = ['en', 'es'];

const LanguageRoute: React.FC<{ component: React.ComponentType }> = ({
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
          <Route path="/" element={<LanguageRoute component={Home} />} />
          <Route path="/about" element={<LanguageRoute component={About} />} />
          <Route
            path="/contact"
            element={<LanguageRoute component={Contact} />}
          />
          <Route
            path="/api-example"
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
        <Routes>
          <Route path="/:lang/*" element={<AppContent />} />
          <Route path="/" element={<Navigate to="/en" replace />} />
        </Routes>
      </ErrorBoundary>
    </HelmetProvider>
  );

  if (useRouter) {
    return <Router>{content}</Router>;
  }

  return content;
};

export default App;
