
// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import Backend from 'i18next-http-backend'; // ✅ move this to top

// i18n
//   .use(Backend) // ✅ use Backend BEFORE init
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: 'en',
//     supportedLngs: ['en', 'ms', 'tr', 'ur', 'id', 'hi', 'bn', 'ar'],
//     // backend: {
//     //   loadPath: '/locales/{{lng}}/common.json', // ✅ correct path
//     // },
//     backend: {
//       loadPath: '/locales/{{lng}}/{{ns}}.json',
//     },
//     detection: {
//       order: ['cookie', 'navigator', 'htmlTag'],
//       caches: ['cookie'],
//       lookupCookie: 'language',
//       cookieMinutes: 525600,
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Load translations via HTTP
  .use(LanguageDetector) // Detect language via cookie, navigator, etc.
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur', 'tr', 'id', 'hi', 'bn', 'ar', 'ms'],
    lowerCaseLng: true, // Force lowercase to match folder names like /locales/en/

    defaultNS: 'common',
    ns: ['common'], // Add more if you use other namespaces

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['cookie', 'htmlTag', 'navigator'],
      lookupCookie: 'language',
      caches: ['cookie'],
      cookieMinutes: 525600, // 1 year
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;




// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import Cookies from 'js-cookie'; // For server-side cookie access

// // Base i18next configuration
// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: 'en',
//     supportedLngs: ['en', 'ms', 'tr', 'ur', 'id', 'hi', 'bn', 'ar'], // Include Arabic
//     interpolation: {
//       escapeValue: false, // React handles XSS
//     },
//     detection: {
//       order: ['cookie', 'navigator', 'htmlTag'], // Prioritize cookie, remove 'path'
//       caches: ['cookie'],
//       lookupCookie: 'language', // Match LanguageSwitcher cookie
//       cookieMinutes: 525600, // 1 year
//     },
//     // Set initial language for server-side rendering
//     // lng: typeof window === 'undefined' ? Cookies.get('language') || 'en' : undefined,
//   });

// // Client-side backend initialization
// if (typeof window !== 'undefined') {
//   import('i18next-http-backend')
//     .then(({ default: Backend }) => {
//       i18n.use(Backend).init({
//         backend: {
//           loadPath: '/locales/{{lng}}/common.json',
//         },
//       });
//     })
//     .catch((error) => {
//       console.error('Failed to load i18next-http-backend:', error);
//     });
// }

// export default i18n;