import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translations'],
  defaultNS: 'translations',
  resources: {
    en: {
      translations: {
        home: {
          title: 'Welcome to the VERT Stack Template',
          cta: 'View API Example',
        },
        about: {
          title: 'About',
          description: 'This is the about page of our VERT stack application.',
        },
        contact: {
          title: 'Contact',
          description:
            'This is the contact page of our VERT stack application.',
        },
        apiExample: {
          title: 'API Integration Example',
        },
        navbar: {
          home: 'Home',
          about: 'About',
          contact: 'Contact',
          apiExample: 'API Example',
        },
      },
    },
  },
});

export default i18n;
