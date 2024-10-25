import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { registerPWA } from './pwa';
import './i18n';
import {
  initMobilePerformanceTracking,
  reportMobileVitals,
} from './utils/performance-utils';

// Initialize performance tracking
if (process.env.NODE_ENV === 'production') {
  initMobilePerformanceTracking();
  reportMobileVitals();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App useRouter={true} />
  </React.StrictMode>,
);

registerPWA();
