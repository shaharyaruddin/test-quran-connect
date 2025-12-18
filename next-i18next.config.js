const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur', 'tr', 'id', 'hi', 'bn', 'ar', 'ms'],
    localeDetection: true,
  },
  detection: {
    order: ['cookie', 'header', 'querystring'],
    caches: ['cookie'],
    lookupCookie: 'language',
  },
  localePath: path.resolve('./public/locales'),
  lowerCaseLng: true,
  debug: process.env.NODE_ENV === 'development', // optional: turn off debug in prod
  fallbackLng: 'en',
  supportedLngs: ['en', 'ur', 'tr', 'id', 'hi', 'bn', 'ar', 'ms'],
  // reloadOnPrerender: process.env.NODE_ENV === 'development', // ← CHANGE THIS LINE
};