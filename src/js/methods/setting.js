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
            for (const idx in settings.languages) {
                const language = settings.languages[idx];

                if (typeof idx !== 'string') {
                    console.error('Global configuration is failed.\nMessage: language key is not a string type.', idx);
                }

                if (!language.weeks) {
                    console.error('Global configuration is failed.\nMessage: You must give `weeks` option of `' + idx + '` language.');
                    break;
                }

                if (!language.monthsLong) {
                    console.error('Global configuration is failed.\nMessage: You must give `monthsLong` option of `' + idx + '` language.');
                    break;
                }

                if (!language.months) {
                    console.error('Global configuration is failed.\nMessage: You must give `months` option of `' + idx + '` language.');
                    break;
                }

                if (language.weeks.length < weeksCount) {
                    console.error('`weeks` must have least ' + weeksCount + ' items.');
                    break;
                }
                else if (language.weeks.length !== weeksCount) {
                    console.warn('`weeks` option over ' + weeksCount + ' items. We recommend to give ' + weeksCount + ' items.');
                }

                if (language.monthsLong.length < monthsCount) {
                    console.error('`monthsLong` must have least ' + monthsCount + ' items.');
                    break;
                }
                else if (language.monthsLong.length !== monthsCount) {
                    console.warn('`monthsLong` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
                }

                if (language.months.length < monthsCount) {
                    console.error('`months` must have least ' + monthsCount + ' items.');
                    break;
                }
                else if (language.months.length !== monthsCount) {
                    console.warn('`months` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
                }

                if (Global.languages.supports.indexOf(settings.language) === -1) {
                    Global.languages.supports.push(settings.language);
                }

                ['weeks', 'monthsLong', 'months'].map(key => {
                    if (Global.languages[key][idx]) {
                        console.warn('`' + idx + '` language is already given however it will be overwriten.');
                    }
                    Global.languages[key][idx] = language[key];
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