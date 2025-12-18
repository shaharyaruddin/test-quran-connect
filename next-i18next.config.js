// // next-i18next.config.js
// module.exports = {
//     i18n: {
//         defaultLocale: 'en',
//         locales: ['en', 'ms', 'tr', 'ur', 'id', 'hi', 'bn', 'ar'], // 'ms' for Malay
//         localeDetection: true, // disable automatic locale detection
//     },
// };
const path = require('path');

module.exports = {
  i18n: {
    reloadOnPrerender: true, // helps in dev
    defaultLocale: 'en',
    locales: ['en', 'ur', 'tr', 'id', 'hi', 'bn', 'ar', 'ms'],
    localeDetection: true, // ADD THIS
  },
  detection: {
    order: ['cookie', 'header', 'querystring'],
    caches: ['cookie'],
    lookupCookie: 'language',
  },
  localePath: path.resolve('./public/locales'),
  lowerCaseLng: true,
  debug: true,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ur', 'tr', 'id', 'hi', 'bn', 'ar', 'ms'],
};
