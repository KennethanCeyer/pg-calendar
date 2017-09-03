define([
    '../manager/index',
    '../component/classNames',
    '../component/helper',
    '../component/models',
    '../component/global',
    './configure',
    'jquery',
    'moment'
], (
    DateManager,
    ClassNames,
    Helper,
    Models,
    Global,
    MethodConfigure,
    $,
    moment
) => {
    const $window = $(window);
    const $document = $(document);

    return function (options) {
        const context = this;

        context.settings = {};
        MethodConfigure.call(context, options);

        context.global = {
            calendarHtml: Helper.Format('<div class="{0} {0}-{4}">\
                                            <div class="{1}">\
                                                <a href="#" class="{1}-nav {1}-prev">\
                                                    <span class="icon-arrow-left {1}-icon"></span>\
                                                </a>\
                                                <div class="{1}-date">\
                                                    <span class="{1}-month"></span>\
                                                    <span class="{1}-year"></span>\
                                                </div>\
                                                <a href="#" class="{1}-nav {1}-next">\
                                                    <span class="icon-arrow-right {1}-icon"></span>\
                                                </a>\
                                            </div>\
                                            <div class="{2}"></div>\
                                            <div class="{3}"></div>\
                                        </div>', Helper.GetClass(Models.ComponentName), ClassNames.top, ClassNames.header, ClassNames.body, context.settings.theme),
            calendarButtonsHtml: Helper.Format('<div class="{0}-group">\
                                                    <a href="#" class="{0} {0}-cancel">Cancel</a>\
                                                    <a href="#" class="{0} {0}-apply">OK</a>\
                                                </div>', ClassNames.button),
            calendarScheduleContainerHtml: Helper.Format('<div class="{0}-schedule-container"></div>', ClassNames.button),
            calendarSchedulePinHtml: Helper.Format('<span class="{0}-schedule-pin {0}-schedule-pin-\\{0\\}" style="background-color: \\{1\\};"></span>', ClassNames.button),
        };

        const rangeClass = Helper.GetSubClass('unitRange');
        const rangeFirstClass = Helper.GetSubClass('unitRangeFirst');
        const rangeLastClass = Helper.GetSubClass('unitRangeLast');
        const activeClass = Helper.GetSubClass('unitActive');
        const activePositionClasses = [Helper.GetSubClass('unitFirstActive'), Helper.GetSubClass('unitSecondActive')];
        const toggleActiveClass = Helper.GetSubClass('unitToggleActive');
        const toggleInactiveClass = Helper.GetSubClass('unitToggleInactive');
        let $calendarButton = null;

        return context.each(function () {
            const $this = $(this);
            const local = {
                initialize: null,
                element: $this,
                calendar: $(context.global.calendarHtml),
                input: $this.is('input'),
                renderer: null,
                current: [null, null],
                date: {
                    all: [],
                    enabled: [],
                    disabled: []
                },
                storage: {
                    activeDates: [],
                    schedules: []
                },
                dateManager: new DateManager(context.settings.date),
                calendarWrapperHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('wrapper')),
                calendarWrapperOverlayHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('wrapperOverlay')),
                context: context
            };
            let $parent = $this;
            let len;

            if (context.settings.initialize === true) {
                local.initialize = local.current[0] = local.dateManager.date.clone();
            }

            this.local = local;

            if (context.settings.reverse === true) {
                local.calendar.addClass(Helper.GetSubClass('reverse'));
            }
            else {
                local.calendar.addClass(Helper.GetSubClass('default'));
            }

            for (let i = context.settings.week; i < context.settings.weeks.length + context.settings.week; i++) {
                if (i < 0) {
                    i = Global.languages.weeks.en.length - i;
                }
                let week = context.settings.weeks[i % context.settings.weeks.length];
                if (typeof week !== 'string') {
                    continue;
                }
                week = week.toUpperCase();
                const $unit = $(Helper.Format('<div class="{0} {0}-{2}">{1}</div>', Helper.GetSubClass('week'), week, Global.languages.weeks.en[i % Global.languages.weeks.en.length].toLowerCase()));
                $unit.appendTo(local.calendar.find('.' + ClassNames.header));
            }

            if (context.settings.buttons === true) {
                $calendarButton = $(context.global.calendarButtonsHtml);
                $calendarButton.appendTo(local.calendar);
            }

            if (local.input === true || context.settings.modal === true) {
                const wrapperActiveClass = Helper.GetSubClass('wrapperActive');
                const overlayActiveClass = Helper.GetSubClass('wrapperOverlayActive');
                let $overlay;

                $parent = $(local.calendarWrapperHtml);
                $parent.bind('click', function (event) {
                    event.stopPropagation();
                });

                $this
                    .bind('click', event => {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        $overlay = $('.' + Helper.GetSubClass('wrapperOverlay'));

                        if ($overlay.length < 1) {
                            $overlay = $(local.calendarWrapperOverlayHtml);
                            $overlay.appendTo('body');
                        }

                        $overlay.unbind('click.' + Helper.GetClass(Models.ComponentName)).bind('click.' + Helper.GetClass(Models.ComponentName), event => {
                            event.stopPropagation();
                            $parent.trigger('cancel.' + Helper.GetClass(Models.ComponentName));
                        });

                        if ($parent.parent().is('body') === false) {
                            $parent.appendTo('body');
                        }

                        $parent.show();
                        $overlay.show();

                        $window.unbind('resize.' + Helper.GetClass(Models.ComponentName)).bind('resize.' + Helper.GetClass(Models.ComponentName), () => {
                            $parent.css({
                                marginLeft: - $parent.outerWidth() / 2,
                                marginTop: - $parent.outerHeight() / 2
                            });
                        }).triggerHandler('resize.' + Helper.GetClass(Models.ComponentName));

                        $this[Models.ComponentName]('set', $this.val());

                        setTimeout(() => {
                            $overlay.addClass(overlayActiveClass);
                            $parent.addClass(wrapperActiveClass);
                        }, 25);
                    })
                    .bind('focus', function (event) {
                        var $this = $(this);
                        $this.blur();
                    });

                $parent
                    .unbind('cancel.' + Helper.GetClass(Models.ComponentName) + ' ' + 'apply.' + Helper.GetClass(Models.ComponentName))
                    .bind('cancel.' + Helper.GetClass(Models.ComponentName) + ' ' + 'apply.' + Helper.GetClass(Models.ComponentName), function () {
                        $overlay.removeClass(overlayActiveClass).hide();
                        $parent.removeClass(wrapperActiveClass).hide();
                    });
            }

            const generateDateRange = () => {
                if (
                    !local.current[0] ||
                    !local.current[1]
                ) {
                    return false;
                }

                const firstSelectDate = local.current[0].format('YYYY-MM-DD');
                const lastSelectDate = local.current[1].format('YYYY-MM-DD');
                const firstDate = moment(Math.max(local.current[0].valueOf(), local.dateManager.date.clone().startOf('month').valueOf()));
                const lastDate = moment(Math.min(local.current[1].valueOf(), local.dateManager.date.clone().endOf('month').valueOf()));
                const firstDateIsUndered = (firstDate.format('YYYY-MM-DD') !== firstSelectDate);
                const lastDateIsOvered = (lastDate.format('YYYY-MM-DD') !== lastSelectDate);

                if (firstDateIsUndered === false) {
                    firstDate.add(1, 'days');
                }

                if (lastDateIsOvered === false) {
                    lastDate.add(-1, 'days');
                }

                const firstDateFixed = firstDate.format('YYYY-MM-DD');
                const lastDateFixed = lastDate.format('YYYY-MM-DD');

                for (; firstDate.format('YYYY-MM-DD') <= lastDate.format('YYYY-MM-DD'); firstDate.add(1, 'days')) {
                    const date = firstDate.format('YYYY-MM-DD');
                    const isRange = true;
                    const $target = local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('unit'), date)).addClass(rangeClass);

                    if (date === firstDateFixed) {
                        $target.addClass(rangeFirstClass);
                    }

                    if (date === lastDateFixed) {
                        $target.addClass(rangeLastClass);
                    }
                }
            };

            const existsBetweenRange = (startDate, endDate, targetDate) => {
                if (targetDate) {
                    if (
                        startDate.diff(targetDate) < 0 &&
                        endDate.diff(targetDate) > 0
                    ) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            };

            const validDate = date => {
                if (context.settings.disabledDates.indexOf(date) !== -1) {
                    return false;
                }

                if (date.diff(context.settings.maxDate) >= 0) {
                    return false;
                }

                if (date.diff(context.settings.minDate) <= 0) {
                    return false;
                }

                for (const idx in context.settings.disabledRanges) {
                    const rangeDate = context.settings.disabledRanges[idx];
                    const startRangeDate = moment(rangeDate[0]);
                    const endRangeDate = moment(rangeDate[1]);

                    if (existsBetweenRange(startRangeDate, endRangeDate, date)) {
                        return false;
                    }
                }


                const weekday = date.weekday();
                if (context.settings.disabledWeekdays.indexOf(weekday) !== -1) {
                    return false;
                }

                return true;
            }

            const validDateArea = (startDate, endDate) => {
                let date;

                for (const idx in context.settings.disabledDates) {
                    date = moment(context.settings.disabledDates[idx]);
                    if (existsBetweenRange(startDate, endDate, date)) {
                        return false;
                    }
                }

                if (existsBetweenRange(startDate, endDate, context.settings.maxDate)) {
                    return false;
                }

                if (existsBetweenRange(startDate, endDate, context.settings.minDate)) {
                    return false;
                }

                for (const idx in context.settings.disabledRanges) {
                    const rangeDate = context.settings.disabledRanges[idx];
                    const startRangeDate = moment(rangeDate[0]);
                    const endRangeDate = moment(rangeDate[1]);

                    if (
                        existsBetweenRange(startDate, endDate, startRangeDate) ||
                        existsBetweenRange(startDate, endDate, endRangeDate)
                    ) {
                        return false;
                    }
                }

                let startWeekday = startDate.weekday();
                let endWeekday = endDate.weekday();
                let tmp;

                if (startWeekday > endWeekday) {
                    tmp = startWeekday;
                    startWeekday = endWeekday;
                    endWeekday = tmp;
                }

                for (let idx = 0, index = 0; idx < context.settings.disabledWeekdays.length && index < 7; idx++) {
                    index++;
                    const week = context.settings.disabledWeekdays[idx];

                    if (
                        week >= startWeekday &&
                        week <= endWeekday
                    ) {
                        return false;
                    }
                }

                return true;
            };

            local.renderer = () => {
                local.calendar.appendTo($parent.empty());
                local.calendar.find('.' + ClassNames.top + '-year').text(local.dateManager.year);
                local.calendar.find('.' + ClassNames.top + '-month').text(context.settings.monthsLong[local.dateManager.month - 1]);
                local.calendar.find(Helper.Format('.{0}-prev .{0}-value', ClassNames.top)).text(context.settings.months[local.dateManager.prevMonth - 1].toUpperCase());
                local.calendar.find(Helper.Format('.{0}-next .{0}-value', ClassNames.top)).text(context.settings.months[local.dateManager.nextMonth - 1].toUpperCase());

                if (context.settings.buttons === true && $calendarButton) {
                    const $super = $this;
                    $calendarButton.find('.' + ClassNames.button).bind('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        const $this = $(this);
                        
                        if ($this.hasClass(ClassNames.button + '-apply')) {
                            $this.trigger('apply.' + Models.ComponentName, local);
                            var value = '';
                            if (context.settings.toggle === true) {
                                value = local.storage.activeDates.join(', ');
                            }
                            else if (context.settings.multiple === true) {
                                var dateValues = [];

                                if (local.current[0] !== null) {
                                    dateValues.push(local.current[0].format(context.settings.format));
                                }

                                if (local.current[1] !== null) {
                                    dateValues.push(local.current[1].format(context.settings.format));
                                }

                                value = dateValues.join(' ~ ');
                            }
                            else {
                                value = local.current[0] === null ? '' : moment(local.current[0]).format(context.settings.format);
                            }

                            if (local.input === true) {
                                $super.val(value).triggerHandler('change');
                            }

                            if (typeof context.settings.apply === 'function') {
                                context.settings.apply.call(local.calendar, local.current, local);
                            }
                            $parent.triggerHandler('apply.' + Helper.GetClass(Models.ComponentName));
                        }
                        else {
                            $parent.triggerHandler('cancel.' + Helper.GetClass(Models.ComponentName));
                        }
                    });
                }

                const $calendarBody = local.calendar.find('.' + ClassNames.body).empty();
                const firstDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.firstDay);
                const lastDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.lastDay);
                let firstWeekday = firstDate.weekday() - context.settings.week;
                let lastWeekday = lastDate.weekday() - context.settings.week;

                if (firstWeekday < 0) {
                    firstWeekday += context.settings.weeks.length;
                }

                const $unitList = [], currentFormat = [
                    local.current[0] === null ? null : local.current[0].format('YYYY-MM-DD'),
                    local.current[1] === null ? null : local.current[1].format('YYYY-MM-DD')
                ], minDate = context.settings.minDate === null ? null : moment(context.settings.minDate),
                    maxDate = context.settings.maxDate === null ? null : moment(context.settings.maxDate);

                for (let i = 0; i < firstWeekday; i++) {
                    var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('unit'), Global.languages.weeks.en[i].toLowerCase()));
                    $unitList.push($unit);
                }

                for (let i = local.dateManager.firstDay; i <= local.dateManager.lastDay; i++) {
                    const iDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, i);
                    const iDateFormat = iDate.format('YYYY-MM-DD');
                    const $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</a></div>', Helper.GetSubClass('unit'), iDate.format('YYYY-MM-DD'), i, Global.languages.weeks.en[iDate.weekday()].toLowerCase()));

                    if (context.settings.enabledDates.length > 0) {
                        if ($.inArray(iDateFormat, context.settings.enabledDates) === -1) {
                            $unit.addClass(Helper.GetSubClass('unitDisabled'));
                        }
                    }
                    else if (context.settings.disabledWeekdays.length > 0 && $.inArray(iDate.weekday(), context.settings.disabledWeekdays) !== -1) {
                        $unit.addClass(Helper.GetSubClass('unitDisabled')).addClass(Helper.GetSubClass('unitDisabledWeekdays'));
                    }
                    else if (
                        (minDate !== null && minDate.diff(iDate) > 0) ||
                        (maxDate !== null && maxDate.diff(iDate) < 0)
                    ) {
                        $unit.addClass(Helper.GetSubClass('unitDisabled')).addClass(Helper.GetSubClass('unitDisabledRange'));
                    }
                    else if ($.inArray(iDateFormat, context.settings.disabledDates) !== -1) {
                        $unit.addClass(Helper.GetSubClass('unitDisabled'));
                    }
                    else if (context.settings.disabledRanges.length > 0) {
                        const disabledRangesLength = context.settings.disabledRanges.length;
                        for (let j = 0; j < disabledRangesLength; j++) {
                            const disabledRange = context.settings.disabledRanges[j];
                            const disabledRangeLength = disabledRange.length;

                            if (iDate.diff(moment(disabledRange[0])) >= 0 && iDate.diff(moment(disabledRange[1])) <= 0) {
                                $unit.addClass(Helper.GetSubClass('unitDisabled')).addClass(Helper.GetSubClass('unitDisabledRange')).addClass(Helper.GetSubClass('unitDisabledMultipleRange'));
                                break;
                            }
                        }
                    }

                    if (
                        context.settings.schedules.length > 0 &&
                        typeof context.settings.scheduleOptions === 'object' &&
                        typeof context.settings.scheduleOptions.colors === 'object'
                    ) {
                        const currentSchedules = context.settings.schedules.filter(function (schedule) {
                            return schedule.date === iDateFormat;
                        });

                        const nameOfSchedules = $.unique(currentSchedules.map(function (schedule, index) {
                            return schedule.name;
                        }).sort());

                        if (nameOfSchedules.length > 0) {
                            //$unit.data('schedules', currentSchedules);
                            const $schedulePinContainer = $(context.global.calendarScheduleContainerHtml);
                            $schedulePinContainer.appendTo($unit);
                            nameOfSchedules.map((name, index) => {
                                if (context.settings.scheduleOptions.colors[name]) {
                                    const color = context.settings.scheduleOptions.colors[name];
                                    const $schedulePin = $(Helper.Format(context.global.calendarSchedulePinHtml, name, color));
                                    $schedulePin.appendTo($schedulePinContainer);
                                }
                            });
                        }
                    }

                    if (context.settings.toggle === true) {
                        if ($.inArray(iDateFormat, local.storage.activeDates) !== -1 && local.storage.activeDates.length > 0) {
                            $unit.addClass(toggleActiveClass);
                        }
                        else {
                            $unit.addClass(toggleInactiveClass);
                        }
                    }
                    else if ($unit.hasClass(Helper.GetSubClass('unitDisabled')) === false) {
                        if (context.settings.multiple === true) {
                            if ((currentFormat[0] && iDateFormat === currentFormat[0])) {
                                $unit.addClass(activeClass).addClass(activePositionClasses[0]);
                            }

                            if ((currentFormat[1] && iDateFormat === currentFormat[1])) {
                                $unit.addClass(activeClass).addClass(activePositionClasses[1]);
                            }
                        }
                        else {
                            if ((currentFormat[0] && iDateFormat === currentFormat[0]) &&
                                $.inArray(currentFormat[0], context.settings.disabledDates) === -1 &&
                                (context.settings.enabledDates.length < 1 || $.inArray(currentFormat[0], context.settings.enabledDates) !== -1)) {
                                $unit.addClass(activeClass).addClass(activePositionClasses[0]);
                            }
                        }
                    }

                    $unitList.push($unit);
                    const $super = $this;

                    $unit.bind('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        const $this = $(this);
                        const date = $this.data('date');
                        let position = 0;
                        let preventSelect = false;

                        if ($this.hasClass(Helper.GetSubClass('unitDisabled'))) {
                            preventSelect = true;
                        }
                        else {
                            if (local.input === true && context.settings.multiple === false && context.settings.buttons === false) {
                                $super.val(moment(date).format(context.settings.format));
                                $parent.triggerHandler('apply.' + Helper.GetClass(Models.ComponentName));
                            }
                            else {
                                if (
                                    local.initialize !== null &&
                                    local.initialize.format('YYYY-MM-DD') === date &&
                                    context.settings.toggle === false
                                ) {
                                }
                                else {
                                    if (context.settings.toggle === true) {
                                        const match = local.storage.activeDates.filter(function (e, i) {
                                            return e === date;
                                        });
                                        local.current[position] = moment(date);

                                        if (match.length < 1) {
                                            local.storage.activeDates.push(date);
                                            $this.addClass(toggleActiveClass).removeClass(toggleInactiveClass);
                                        }
                                        else {
                                            let index = 0;
                                            for (let idx = 0; idx < local.storage.activeDates.length; idx++) {
                                                const targetDate = local.storage.activeDates[idx];

                                                if (date === targetDate) {
                                                    index = idx;
                                                    break;
                                                }
                                            }
                                            local.storage.activeDates.splice(index, 1);
                                            $this.removeClass(toggleActiveClass).addClass(toggleInactiveClass);
                                        }
                                    }
                                    else if (
                                        $this.hasClass(activeClass) === true &&
                                        context.settings.pickWeeks === false
                                    ) {
                                        if (context.settings.multiple === true) {
                                            if ($this.hasClass(activePositionClasses[0])) {
                                                position = 0;
                                            }
                                            else if (activePositionClasses[1]) {
                                                position = 1;
                                            }
                                        }
                                        $this.removeClass(activeClass).removeClass(activePositionClasses[position]);
                                        local.current[position] = null;
                                    }
                                    else {
                                        if (context.settings.pickWeeks === true) {
                                            if (
                                                $this.hasClass(activeClass) === true ||
                                                $this.hasClass(rangeClass) === true
                                            ) {
                                                for (let j = 0; j < 2; j++) {
                                                    local.calendar.find('.' + activeClass + '.' + activePositionClasses[j]).removeClass(activeClass).removeClass(activePositionClasses[j]);
                                                }

                                                local.current[0] = null;
                                                local.current[1] = null;
                                            }
                                            else {
                                                local.current[0] = moment(date).startOf('week').add(context.settings.week, 'days');
                                                local.current[1] = moment(date).endOf('week').add(context.settings.week, 'days');

                                                for (let j = 0; j < 2; j++) {
                                                    local.calendar.find('.' + activeClass + '.' + activePositionClasses[j]).removeClass(activeClass).removeClass(activePositionClasses[j]);
                                                    local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('unit'), local.current[j].format('YYYY-MM-DD'))).addClass(activeClass).addClass(activePositionClasses[j]);
                                                }
                                            }
                                        }
                                        else {
                                            if (context.settings.multiple === true) {
                                                if (local.current[0] === null) {
                                                    position = 0;
                                                }
                                                else if (local.current[1] === null) {
                                                    position = 1;
                                                }
                                                else {
                                                    position = 0;
                                                    local.current[1] = null;
                                                    local.calendar.find('.' + activeClass + '.' + activePositionClasses[1]).removeClass(activeClass).removeClass(activePositionClasses[1]);
                                                }
                                            }

                                            local.calendar.find('.' + activeClass + '.' + activePositionClasses[position]).removeClass(activeClass).removeClass(activePositionClasses[position]);
                                            $this.addClass(activeClass).addClass(activePositionClasses[position]);
                                            local.current[position] = moment(date);
                                        }

                                        if (
                                            local.current[0] &&
                                            local.current[1]
                                        ) {
                                            if (local.current[0].diff(local.current[1]) > 0) {
                                                let tmp = local.current[0];
                                                local.current[0] = local.current[1];
                                                local.current[1] = tmp;
                                                tmp = null;

                                                local.calendar.find('.' + activeClass).each(function () {
                                                    const $this = $(this);
                                                    for (const idx in activePositionClasses) {
                                                        const className = activePositionClasses[idx];
                                                        $this.toggleClass(className);
                                                    }
                                                });
                                            }

                                            if (
                                                validDateArea(local.current[0], local.current[1]) === false &&
                                                context.settings.selectOver === false
                                            ) {
                                                local.current[0] = null;
                                                local.current[1] = null;
                                                local.calendar.find('.' + activeClass).removeClass(activeClass).removeClass(activePositionClasses[0]).removeClass(activePositionClasses[1]);
                                            }

                                            if (local.input === true && context.settings.buttons === false) {
                                                const dateValues = []

                                                if (local.current[0] !== null) {
                                                    dateValues.push(local.current[0].format(context.settings.format));
                                                }

                                                if (local.current[1] !== null) {
                                                    dateValues.push(local.current[1].format(context.settings.format));
                                                }

                                                $this.val(dateValues.join(', '));
                                                $parent.trigger('apply.' + Helper.GetClass(Models.ComponentName));
                                            }
                                        }
                                    }

                                    if (context.settings.multiple === true) {
                                        local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
                                        generateDateRange.call();
                                    }

                                    if (context.settings.schedules.length > 0) {
                                        local.storage.schedules = context.settings.schedules.filter(event => {
                                            return event.date === date;
                                        });
                                    }
                                }
                            }
                        }

                        const classifyDate = date => {
                            local.date.all.push(date);
                            if (validDate(moment(date))) {
                                local.date.enabled.push(date);
                            }
                            else {
                                local.date.disabled.push(date);
                            }
                        };

                        if (local.current[0]) {
                            if (local.current[1]) {
                                const startDate = local.current[0];
                                const date = startDate.clone();

                                for (; date.format('YYYY-MM-DD') <= local.current[1].format('YYYY-MM-DD'); date.add('1', 'days')) {
                                    classifyDate(date.clone());
                                }
                            }
                            else {
                                const date = local.current[0];
                                classifyDate(date.clone());
                            }
                        }

                        if (preventSelect === false) {
                            local.initialize = null;

                            if (typeof context.settings.select === 'function') {
                                context.settings.select.call($this, local.current, local);
                            }
                        }

                        if (typeof context.settings.click === 'function') {
                            context.settings.click.call($this, event, local);
                        }
                    });
                }

                for (let i = lastWeekday + 1; $unitList.length < context.settings.weeks.length * 5; i++) {
                    if (i < 0) {
                        i = Global.languages.weeks.en.length - i;
                    }
                    const $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('unit'), Global.languages.weeks.en[i % Global.languages.weeks.en.length].toLowerCase()));
                    $unitList.push($unit);
                }

                let $row = null;
                for (let i = 0; i < $unitList.length; i++) {
                    const element = $unitList[i];
                    if (i % context.settings.weeks.length == 0 || i + 1 >= $unitList.length) {
                        if ($row !== null) {
                            $row.appendTo($calendarBody);
                        }

                        if (i + 1 < $unitList.length) {
                            $row = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('row')));
                        }
                    }
                    $row.append(element);
                }

                local.calendar.find('.' + ClassNames.top + '-nav').bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const $this = $(this);
                    let type = 'unkown';

                    if ($this.hasClass(ClassNames.top + '-prev')) {
                        type = 'prev';
                        local.dateManager = new DateManager(local.dateManager.date.clone().add(-1, 'months'));
                    }
                    else if ($this.hasClass(ClassNames.top + '-next')) {
                        type = 'next';
                        local.dateManager = new DateManager(local.dateManager.date.clone().add(1, 'months'));
                    }

                    if (typeof context.settings.page === 'function') {
                        context.settings.page.call($this, {
                            type: type,
                            year: local.dateManager.year,
                            month: local.dateManager.month,
                            day: local.dateManager.day
                        }, local);
                    }

                    if (typeof context.settings[type] === 'function') {
                        context.settings[type].call($this, {
                            type: type,
                            year: local.dateManager.year,
                            month: local.dateManager.month,
                            day: local.dateManager.day
                        }, local);
                    }

                    local.renderer.call();
                });

                if (context.settings.multiple === true) {
                    local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
                    generateDateRange.call();
                }
            };

            local.renderer.call();
            $this[0][Models.ComponentName] = local;

            if (typeof context.settings.init === 'function') {
                context.settings.init.call($this, local);
            }
        });
    };
});