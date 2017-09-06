define([
    '../component/global',
    '../component/models',
    '../component/options',
    '../configures/i18n',
    'jquery',
    'moment'
], (
    Global,
    Models,
    Options,
    language,
    $,
    moment
) => {
    return function (settings) {
        const context = this;settings

        context.settings = $.extend(true, {}, Options, settings);

        if (!context.settings.lang) {
            context.settings.lang = Global.language;
        }

        if (context.settings.lang !== 'en' &&
            $.inArray(context.settings.lang, Global.languages.supports) !== -1) {
            context.settings.weeks = Global.languages.weeks[context.settings.lang];
            context.settings.monthsLong = Global.languages.monthsLong[context.settings.lang];
            context.settings.months = Global.languages.months[context.settings.lang];
        }

        if (context.settings.theme !== 'light' &&
            $.inArray(context.settings.theme, Models.ComponentPreference.supports.themes) === -1) {
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