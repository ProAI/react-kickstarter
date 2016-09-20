export default function getLocaleFromHeader(acceptLanguageHeader, availableLanguages) {
  if (acceptLanguageHeader === undefined) {
    return null;
  }

  const localeArray = acceptLanguageHeader.replace(/\s+/g, '').split(',');

  const locales = [];

  for (const localePair of localeArray) {
    const locale = localePair.split(';');

    if (locale[1] === undefined) {
      locale[1] = 1;
    } else {
      locale[1] = locale[1].replace(/q=/g, '');
    }

    locales[locale[0]] = locale[1];
  }

  let returnLocale = null;
  locales.forEach((locale) => {
    if (availableLanguages.indexOf(locale) > -1) {
      returnLocale = locale;
    }
  });

  return returnLocale;
}