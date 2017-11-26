define([
  '../component/global',
  '../component/models',
  '../component/options',
  '../configures/i18n',
  'jquery'
], (global,
    models,
    options,
    language,
    $) => {
  return function (settings) {
    const context = this;
    settings

    context.settings = $.extend(true, {}, options, settings);

    if (!context.settings.lang) {
      context.settings.lang = global.language;
    }

    if (context.settings.lang !== language.defaultLanguage &&
      $.inArray(context.settings.lang, global.languages.supports) !== -1) {
      // weeks
      context.settings.weeks = global.languages.weeks[context.settings.lang] ||
        global.languages.weeks[language.defaultLanguage];
      // monthsLong
      context.settings.monthsLong = global.languages.monthsLong[context.settings.lang] ||
        global.languages.monthsLong[language.defaultLanguage];
      // months
      context.settings.months = global.languages.months[context.settings.lang] ||
        global.languages.months[language.defaultLanguage];
      // controls
      context.settings.controls = global.languages.controls[context.settings.lang] ||
        global.languages.controls[language.defaultLanguage];
    }

    if (context.settings.theme !== 'light' &&
      $.inArray(context.settings.theme, models.preference.supports.themes) === -1) {
      context.settings.theme = 'light';
    }

    if (context.settings.pickWeeks === true) {
      if (context.settings.multiple === false) {
        console.error('You must give true at settings.multiple options on PIGNOSE-Calendar for using in pickWeeks option.');
      }
      else if (context.settings.toggle === true) {
        console.error('You must give false at settings.toggle options on PIGNOSE-Calendar for using in pickWeeks option.');
      }
    }

    context.settings.week %= context.settings.weeks.length;
  };
});