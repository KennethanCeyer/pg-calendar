define([
  '../component/global',
  '../configures/i18n',
  'jquery'
], (global,
    language,
    $) => {
  return options => {
    const settings = $.extend({
      language: global.language,
      languages: {},
      week: null,
      format: null
    }, options);
    const monthsCount = 12;
    const weeksCount = 7;

    global.language = settings.language;

    if (Object.keys(settings.languages).length > 0) {
      for (const language in settings.languages) {
        const languageSetting = settings.languages[language];

        if (typeof language !== 'string') {
          console.error('global configuration is failed.\nMessage: language key is not a string type.', language);
        }

        if (!languageSetting.weeks) {
          console.warn('Warning: `weeks` option of `' + language + '` language is missing.');
          break;
        }

        if (!languageSetting.monthsLong) {
          console.warn('Warning: `monthsLong` option of `' + language + '` language is missing.');
          break;
        }

        if (!languageSetting.months) {
          console.warn('Warning: `months` option of `' + language + '` language is missing.');
          break;
        }

        if (!languageSetting.controls) {
          console.warn('Warning: `controls` option of `' + language + '` language is missing.');
          break;
        }

        if (languageSetting.weeks) {
          if (languageSetting.weeks.length < weeksCount) {
            console.error('`weeks` must have least ' + weeksCount + ' items.');
            break;
          }
          else if (languageSetting.weeks.length !== weeksCount) {
            console.warn('`weeks` option over ' + weeksCount + ' items. We recommend to give ' + weeksCount + ' items.');
          }
        }

        if (languageSetting.monthsLong) {
          if (languageSetting.monthsLong.length < monthsCount) {
            console.error('`monthsLong` must have least ' + monthsCount + ' items.');
            break;
          }
          else if (languageSetting.monthsLong.length !== monthsCount) {
            console.warn('`monthsLong` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
          }
        }

        if (languageSetting.months) {
          if (languageSetting.months.length < monthsCount) {
            console.error('`months` must have least ' + monthsCount + ' items.');
            break;
          }
          else if (languageSetting.months.length !== monthsCount) {
            console.warn('`months` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
          }
        }

        if (languageSetting.controls) {
          if (!languageSetting.controls.ok) {
            console.error('`controls.ok` value is missing in your language setting');
            break;
          }

          if (!languageSetting.controls.cancel) {
            console.error('`controls.cancel` value is missing in your language setting');
            break;
          }
        }

        if (global.languages.supports.indexOf(language) === -1) {
          global.languages.supports.push(language);
        }

        ['weeks', 'monthsLong', 'months', 'controls'].map(key => {
          if (global.languages[key][language]) {
            console.warn('`' + language + '` language is already given however it will be overwriten.');
          }
          global.languages[key][language] = languageSetting[key] || global.languages[key][language.defaultLanguage];
        });
      }
    }

    if (settings.week) {
      if (typeof settings.week === 'number') {
        global.week = settings.week;
      }
      else {
        console.error('global configuration is failed.\nMessage: You must give `week` option as number type.');
      }
    }

    if (settings.format) {
      if (typeof settings.format === 'string') {
        global.format = settings.format;
      }
      else {
        console.error('global configuration is failed.\nMessage: You must give `format` option as string type.');
      }
    }
  };
})