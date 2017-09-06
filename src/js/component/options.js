define([
    './global'
], (
    Global
) => {
    return {
        lang: null,
        languages: Global.languages,
        theme: 'light',
        date: moment(),
        format: Global.format,
        enabledDates: [],
        disabledDates: [],
        disabledWeekdays: [],
        disabledRanges: [],
        schedules: [],
        scheduleOptions: {
            colors: {}
        },
        week: Global.week,
        weeks: Global.languages.weeks.en,
        monthsLong: Global.languages.monthsLong.en,
        months: Global.languages.months.en,
        pickWeeks: false,
        initialize: true,
        multiple: false,
        toggle: false,
        reverse: false,
        buttons: false,
        modal: false,
        selectOver: false,
        minDate: null,
        maxDate: null,

        /********************************************
         * EVENTS
         *******************************************/
        init: null,
        select: null,
        apply: null,
        click: null,
        page: null,
        prev: null,
        next: null
    };
});