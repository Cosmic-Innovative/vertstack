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
          description:
            'This template provides a solid foundation for building modern web applications using:',
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
          description:
            'This page demonstrates how to integrate an external API using the VERT stack. It showcases fetching data, handling loading and error states, and displaying the results.',
        },
        navbar: {
          home: 'Home',
          about: 'About',
          contact: 'Contact',
          apiExample: 'API Example',
        },
      },
    },
    es: {
      translations: {
        // Add Spanish translations here
      },
    },
  },
});

export default i18n;
