define([
    '../component/global',
    '../component/models',
    '../component/options',
    '../configures/i18n',
    'jquery'
], (
    global,
    models,
    options,
    language,
    $
) => function Configure(_settings) {
    const languages = global.languages;

    this.settings = $.extend(true, {}, options, _settings);
    const settings = this.settings;

    if (!settings.lang)
        settings.lang = global.language;

    if (settings.lang !== language.defaultLanguage && languages.supports.includes(settings.lang))
        ['weeks', 'monthsLong', 'months', 'controls'].forEach(key =>
            settings[key] = languages[key][settings.lang] || languages[key][language.defaultLanguage]);

    if (settings.theme !== 'light' && !models.preference.supports.themes.includes(settings.theme))
        settings.theme = 'light';

    if (settings.pickWeeks)
        if (!settings.multiple)
            console.error('You must give true at settings.multiple options on PIGNOSE-Calendar for using in pickWeeks option.');
        else if (settings.toggle)
            console.error('You must give false at settings.toggle options on PIGNOSE-Calendar for using in pickWeeks option.');

    settings.week %= settings.weeks.length;
});
