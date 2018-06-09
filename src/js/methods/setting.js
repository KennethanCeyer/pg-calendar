define([
    '../component/global',
    '../component/error',
    '../configures/i18n',
    'jquery'
], (
    global,
    error,
    language,
    $
) => options => {
    const settings = $.extend({
        language: global.language,
        languages: {},
        week: null,
        format: null
    }, options);
    const monthsCount = 12;
    const weeksCount = 7;
    const rules = [
        { name: 'weeks', items: weeksCount },
        { name: 'monthsLong', items: monthsCount },
        { name: 'months', items: monthsCount },
        { name: 'controls', items: 0 }
    ];

    global.language = settings.language;

    if (Object.keys(settings.languages).length ) {
        settings.languages.forEach((languageSetting, language) => {
            if (typeof language !== 'string')
                console.error('global configuration is failed.\nMessage: language key is not a string type.', language);

            rules.forEach(rule => {
                if (!languageSetting[rule.name])
                    console.warn(error.languageMissing(language, rule.name));

                if (global.languages[rule.name][language])
                    console.warn(`\`${language}\` language is already given however it will be overwritten.`);

                global.languages[rule.name][language] =
                    languageSetting[key] || global.languages[key][language.defaultLanguage];

                if (rule.items && languageSetting[rule.name])
                    if (languageSetting[rule.name].length < rule.items)
                        console.error(error.itemInsufficient(rule.name, rule.items));
                    else if(languageSetting[rule.name].length !== rule.items)
                        console.warn(error.itemNotEqual(rule.name, rule.items));

            });

            if (languageSetting.controls) {
                ['ok', 'cancel'].forEach(name => {
                    if (!languageSetting.controls[name])
                        console.error(error.controlMissing(name));
                });
            }

            if (!global.languages.supports.includes(language))
                global.languages.supports.push(language);
        });
    }

    if (settings.week)
        if (typeof settings.week === 'number')
            global.week = settings.week;
        else
            console.error(error.invalidType('week', 'number'));

    if (settings.format)
        if (typeof settings.format === 'string')
            global.format = settings.format;
        else
            console.error(error.invalidType('format', 'string'));
});
