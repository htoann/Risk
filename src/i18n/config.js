import { getLocalStorage } from '@/utils/storage/localStorage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: getLocalStorage('lang') || 'en',
  resources: {
    en: {
      translations: en,
    },
  },
  ns: ['translations'],
  defaultNS: 'translations',
});

i18n.languages = ['en'];

export default i18n;
