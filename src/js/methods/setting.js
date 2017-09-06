define([
    '../component/global',
    'jquery',
    'moment'
], (
    Global,
    $,
    moment
) => {
    return options => {
        const settings = $.extend({
            language: Global.language,
            languages: {},
            week: null,
            format: null
        }, options);
        const monthsCount = 12;
        const weeksCount = 7;

        Global.language = settings.language;

        if (Object.keys(settings.languages).length > 0) {
            for (const language in settings.languages) {
                const languageSetting = settings.languages[language];

                if (typeof language !== 'string') {
                    console.error('Global configuration is failed.\nMessage: language key is not a string type.', language);
                }

                if (!languageSetting.weeks) {
                    console.error('Global configuration is failed.\nMessage: You must give `weeks` option of `' + language + '` language.');
                    break;
                }

                if (!languageSetting.monthsLong) {
                    console.error('Global configuration is failed.\nMessage: You must give `monthsLong` option of `' + language + '` language.');
                    break;
                }

                if (!languageSetting.months) {
                    console.error('Global configuration is failed.\nMessage: You must give `months` option of `' + language + '` language.');
                    break;
                }

                if (languageSetting.weeks.length < weeksCount) {
                    console.error('`weeks` must have least ' + weeksCount + ' items.');
                    break;
                }
                else if (languageSetting.weeks.length !== weeksCount) {
                    console.warn('`weeks` option over ' + weeksCount + ' items. We recommend to give ' + weeksCount + ' items.');
                }

                if (languageSetting.monthsLong.length < monthsCount) {
                    console.error('`monthsLong` must have least ' + monthsCount + ' items.');
                    break;
                }
                else if (languageSetting.monthsLong.length !== monthsCount) {
                    console.warn('`monthsLong` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
                }

                if (languageSetting.months.length < monthsCount) {
                    console.error('`months` must have least ' + monthsCount + ' items.');
                    break;
                }
                else if (languageSetting.months.length !== monthsCount) {
                    console.warn('`months` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
                }

                if (Global.languages.supports.indexOf(language) === -1) {
                    Global.languages.supports.push(language);
                }

                ['weeks', 'monthsLong', 'months'].map(key => {
                    if (Global.languages[key][language]) {
                        console.warn('`' + language + '` language is already given however it will be overwriten.');
                    }
                    Global.languages[key][language] = languageSetting[key];
                });
            }
        }

        if (settings.week) {
            if (typeof settings.week === 'number') {
                Global.week = settings.week;
            }
            else {
                console.error('Global configuration is failed.\nMessage: You must give `week` option as number type.');
            }
        }

        if (settings.format) {
            if (typeof settings.format === 'string') {
                Global.format = settings.format;
            }
            else {
                console.error('Global configuration is failed.\nMessage: You must give `format` option as string type.');
            }
        }
    };
})