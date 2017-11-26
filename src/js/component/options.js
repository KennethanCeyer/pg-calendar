define([
  'moment',
  './global'
], (moment, global) => {
  return {
    lang: null,
    languages: global.languages,
    theme: 'light',
    date: moment(),
    format: global.format,
    enabledDates: [],
    disabledDates: [],
    disabledWeekdays: [],
    disabledRanges: [],
    schedules: [],
    scheduleOptions: {
      colors: {}
    },
    week: global.week,
    weeks: global.languages.weeks.en,
    monthsLong: global.languages.monthsLong.en,
    months: global.languages.months.en,
    controls: global.languages.controls.en,
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