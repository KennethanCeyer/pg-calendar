define([
  '../configures/i18n'
], (languages) => {
  return {
    language: languages.defaultLanguage,
    languages: languages,
    week: 0,
    format: 'YYYY-MM-DD'
  };
});