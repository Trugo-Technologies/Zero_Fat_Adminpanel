let currentLanguage = JSON.parse(localStorage.getItem('lan') || '') || {
  languageId: 'english',
  locale: 'en',
  name: 'English',
};

export const getValueBasedOnCurrentLanguage = (nameAr: string, nameEn: string) => {
  if (currentLanguage && typeof currentLanguage === 'object' && currentLanguage?.locale === 'en') {
    return nameEn;
  } else if (currentLanguage && typeof currentLanguage === 'object' && currentLanguage?.locale === 'ar') return nameAr;
  return '';
};
