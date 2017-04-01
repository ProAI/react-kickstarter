export default function getLocaleFromUrl(url, availableLanguages) {
  for (const language of availableLanguages) {
    if (url === `/${language}` || url.substring(0, 4) === `/${language}/`) {
      return language;
    }
  }

  return null;
}
