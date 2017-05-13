define([
  './manager/index',
  './component/index',
  './component/models',
  './component/polyfills',
  'jquery',
  'moment'
], function (DateManager, Helper, models, polyfills, $, moment) {
  'use strict';
  window[models.ComponentName] = {
    VERSION: models.ComponentVersion
  };

  var $window = $(window);
  var $document = $(document);

  var _calendarTopClass = Helper.GetSubClass('Top');
  var _calendarHeaderClass = Helper.GetSubClass('Header');
  var _calendarBodyClass = Helper.GetSubClass('Body');
  var _calendarButtonClass = Helper.GetSubClass('Button');

  var global = {
    language: 'en',
    languages: {
      supports: ['en', 'ko', 'fr', 'ch', 'de', 'jp', 'pt', 'da', 'pl', 'es'],
      weeks: {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        ko: ['일', '월', '화', '수', '목', '금', '토'],
        fa: ['شنبه', 'آدینه', 'پنج', 'چهار', 'سه', 'دو', 'یک'],
        fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        ch: ['日', '一', '二', '三', '四', '五', '六'],
        de: ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'],
        jp: ['日', '月', '火', '水', '木', '金', '土'],
        pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        da: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
        pl: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],
        es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      },
      monthsLong: {
        en: ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'],
        ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        fa: ['آذر', 'آبان', 'مهر', 'شهریور', 'مرداد', 'تیر', 'خرداد', 'اردیبهشت', 'فروردین', 'اسفند', 'بهمن', 'دی'],
        fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        ch: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        da: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
        pl: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
        es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      },
      months: {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        fa: ['آذر', 'آبان', 'مهر', 'شهریور', 'مرداد', 'تیر', 'خرداد', 'اردیبهشت', 'فروردین', 'اسفند', 'بهمن', 'دی'],
        fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        ch: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        de: ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        da: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        pl: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
        es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
      }
    },
    week: 0,
    format: 'YYYY-MM-DD'
  };

  var Component = {
    init: function (options) {
      var _this = this;

      this.settings = {};
      Component.configure.call(this, options);

      this.global = {
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
											</div>', Helper.GetClass(models.ComponentName), _calendarTopClass, _calendarHeaderClass, _calendarBodyClass, _this.settings.theme),
        calendarButtonsHtml: Helper.Format('<div class="{0}-group">\
														<a href="#" class="{0} {0}-cancel">Cancel</a>\
														<a href="#" class="{0} {0}-apply">OK</a>\
													</div>', _calendarButtonClass),
        calendarScheduleContainerHtml: Helper.Format('<div class="{0}-schedule-container"></div>', _calendarButtonClass),
        calendarSchedulePinHtml: Helper.Format('<span class="{0}-schedule-pin {0}-schedule-pin-\\{0\\}" style="background-color: \\{1\\};"></span>', _calendarButtonClass),
      };

      var rangeClass = Helper.GetSubClass('UnitRange');
      var rangeFirstClass = Helper.GetSubClass('UnitRangeFirst');
      var rangeLastClass = Helper.GetSubClass('UnitRangeLast');
      var activeClass = Helper.GetSubClass('UnitActive');
      var activePositionClasses = [Helper.GetSubClass('UnitFirstActive'), Helper.GetSubClass('UnitSecondActive')];
      var toggleActiveClass = Helper.GetSubClass('UnitToggleActive');
      var toggleInactiveClass = Helper.GetSubClass('UnitToggleInactive');

      return this.each(function () {
        var $this = $(this);
        var $parent = $this;
        var local = {
          initialize: null,
          element: $this,
          calendar: $(_this.global.calendarHtml),
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
          dateManager: new DateManager(_this.settings.date),
          calendarWrapperHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Wrapper')),
          calendarWrapperOverlayHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('WrapperOverlay')),
          context: _this
        };
        var len;

        if (_this.settings.initialize === true) {
          local.initialize = local.current[0] = local.dateManager.date.clone();
        }

        this.local = local;

        if (_this.settings.reverse === true) {
          local.calendar.addClass(Helper.GetSubClass('Reverse'));
        } else {
          local.calendar.addClass(Helper.GetSubClass('Default'));
        }

        for (var i = _this.settings.week; i < _this.settings.weeks.length + _this.settings.week; i++) {
          if (i < 0) {
            i = global.languages.weeks.en.length - i;
          }
          var week = _this.settings.weeks[i % _this.settings.weeks.length];
          if (typeof week !== 'string') {
            continue;
          }
          week = week.toUpperCase();
          var $unit = $(Helper.Format('<div class="{0} {0}-{2}">{1}</div>', Helper.GetSubClass('Week'), week, global.languages.weeks.en[i % global.languages.weeks.en.length].toLowerCase()));
          $unit.appendTo(local.calendar.find('.' + _calendarHeaderClass));
        }

        if (_this.settings.buttons === true) {
          var $calendarButton = $(_this.global.calendarButtonsHtml);
          $calendarButton.appendTo(local.calendar);
        }

        if (local.input === true || _this.settings.modal === true) {
          var wrapperActiveClass = Helper.GetSubClass('WrapperActive');
          var overlayActiveClass = Helper.GetSubClass('WrapperOverlayActive');
          var $overlay;

          $parent = $(local.calendarWrapperHtml);
          $parent.bind('click', function (event) {
            event.stopPropagation();
          });

          $this
            .bind('click', function (event) {
              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();
              $overlay = $('.' + Helper.GetSubClass('WrapperOverlay'));
              if ($overlay.length < 1) {
                $overlay = $(local.calendarWrapperOverlayHtml);
                $overlay.appendTo('body');
              }

              $overlay.unbind('click.' + Helper.GetClass(models.ComponentName)).bind('click.' + Helper.GetClass(models.ComponentName), function (event) {
                event.stopPropagation();
                $parent.trigger('cancel.' + Helper.GetClass(models.ComponentName));
              });

              if ($parent.parent().is('body') === false) {
                $parent.appendTo('body');
              }

              $parent.show();
              $overlay.show();

              $window.unbind('resize.' + Helper.GetClass(models.ComponentName)).bind('resize.' + Helper.GetClass(models.ComponentName), function () {
                $parent.css({
                  marginLeft: - $parent.outerWidth() / 2,
                  marginTop: - $parent.outerHeight() / 2
                });
              }).triggerHandler('resize.' + Helper.GetClass(models.ComponentName));

              $this[models.ComponentName]('set', $this.val());

              setTimeout(function () {
                $overlay.addClass(overlayActiveClass);
                $parent.addClass(wrapperActiveClass);
              }, 25);
            })
            .bind('focus', function (event) {
              var $this = $(this);
              $this.blur();
            });

          $parent
            .unbind('cancel.' + Helper.GetClass(models.ComponentName) + ' ' + 'apply.' + Helper.GetClass(models.ComponentName))
            .bind('cancel.' + Helper.GetClass(models.ComponentName) + ' ' + 'apply.' + Helper.GetClass(models.ComponentName), function () {
              $overlay.removeClass(overlayActiveClass).hide();
              $parent.removeClass(wrapperActiveClass).hide();
            });
        }

        var generateDateRange = function () {
          if (local.current[0] === null || local.current[1] === null) {
            return false;
          }
          var firstSelectDate = local.current[0].format('YYYY-MM-DD');
          var lastSelectDate = local.current[1].format('YYYY-MM-DD');
          var firstDate = moment(Math.max(local.current[0].valueOf(), local.dateManager.date.clone().startOf('month').valueOf()));
          var lastDate = moment(Math.min(local.current[1].valueOf(), local.dateManager.date.clone().endOf('month').valueOf()));
          var firstDateIsUndered = (firstDate.format('YYYY-MM-DD') !== firstSelectDate);
          var lastDateIsOvered = (lastDate.format('YYYY-MM-DD') !== lastSelectDate);

          if (firstDateIsUndered === false) {
            firstDate.add(1, 'days');
          }

          if (lastDateIsOvered === false) {
            lastDate.add(-1, 'days');
          }

          var firstDateFixed = firstDate.format('YYYY-MM-DD');
          var lastDateFixed = lastDate.format('YYYY-MM-DD');

          for (; firstDate.format('YYYY-MM-DD') <= lastDate.format('YYYY-MM-DD'); firstDate.add(1, 'days')) {
            var date = firstDate.format('YYYY-MM-DD');
            var isRange = true;
            var $target = local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('Unit'), date)).addClass(rangeClass);

            if (date === firstDateFixed) {
              $target.addClass(rangeFirstClass);
            }

            if (date === lastDateFixed) {
              $target.addClass(rangeLastClass);
            }
          }
        };

        var existsBetweenRange = function (startDate, endDate, targetDate) {
          if (typeof targetDate !== 'undefined' && targetDate !== null) {
            if (
              startDate.diff(targetDate) < 0 &&
              endDate.diff(targetDate) > 0
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };

        var validDate = function (date) {
          if (_this.settings.disabledDates.indexOf(date) !== -1) {
            return false;
          }

          if (date.diff(_this.settings.maxDate) >= 0) {
            return false;
          }

          if (date.diff(_this.settings.minDate) <= 0) {
            return false;
          }

          for (idx in _this.settings.disabledRanges) {
            rangeDate = _this.settings.disabledRanges[idx];
            var startRangeDate = moment(rangeDate[0]);
            var endRangeDate = moment(rangeDate[1]);

            if (existsBetweenRange(startRangeDate, endRangeDate, date)) {
              return false;
            }
          }


          var weekday = date.weekday();
          if (_this.settings.disabledWeekdays.indexOf(weekday) !== -1) {
            return false;
          }

          return true;
        }

        var validDateArea = function (startDate, endDate) {
          var idx, date, index;

          for (idx in _this.settings.disabledDates) {
            date = moment(_this.settings.disabledDates[idx]);
            if (existsBetweenRange(startDate, endDate, date)) {
              return false;
            }
          }

          if (existsBetweenRange(startDate, endDate, _this.settings.maxDate)) {
            return false;
          }

          if (existsBetweenRange(startDate, endDate, _this.settings.minDate)) {
            return false;
          }

          for (idx in _this.settings.disabledRanges) {
            rangeDate = _this.settings.disabledRanges[idx];
            var startRangeDate = moment(rangeDate[0]);
            var endRangeDate = moment(rangeDate[1]);

            if (
              existsBetweenRange(startDate, endDate, startRangeDate) ||
              existsBetweenRange(startDate, endDate, endRangeDate)
            ) {
              return false;
            }
          }


          var startWeekday = startDate.weekday();
          var endWeekday = endDate.weekday();
          var tmp;

          if (startWeekday > endWeekday) {
            tmp = startWeekday;
            startWeekday = endWeekday;
            endWeekday = tmp;
          }

          for (idx = 0, index = 0; idx < _this.settings.disabledWeekdays.length && index < 7; idx++) {
            index++;
            var week = _this.settings.disabledWeekdays[idx];

            if (
              week >= startWeekday &&
              week <= endWeekday
            ) {
              return false;
            }
          }

          return true;
        };

        local.renderer = function () {
          local.calendar.appendTo($parent.empty());
          local.calendar.find('.' + _calendarTopClass + '-year').text(local.dateManager.year);
          local.calendar.find('.' + _calendarTopClass + '-month').text(_this.settings.monthsLong[local.dateManager.month - 1]);
          local.calendar.find(Helper.Format('.{0}-prev .{0}-value', _calendarTopClass)).text(_this.settings.months[local.dateManager.prevMonth - 1].toUpperCase());
          local.calendar.find(Helper.Format('.{0}-next .{0}-value', _calendarTopClass)).text(_this.settings.months[local.dateManager.nextMonth - 1].toUpperCase());

          if (_this.settings.buttons === true) {
            var $super = $this;
            $calendarButton.find('.' + _calendarButtonClass).bind('click', function (event) {
              event.preventDefault();
              event.stopPropagation();
              var $this = $(this);
              if ($this.hasClass(_calendarButtonClass + '-apply')) {
                $this.trigger('apply.' + models.ComponentName, local);
                var value = '';
                if (_this.settings.toggle === true) {
                  value = local.storage.activeDates.join(', ');
                } else if (_this.settings.multiple === true) {
                  var dateValues = [];

                  if (local.current[0] !== null) {
                    dateValues.push(local.current[0].format(_this.settings.format));
                  }

                  if (local.current[1] !== null) {
                    dateValues.push(local.current[1].format(_this.settings.format));
                  }

                  value = dateValues.join(' ~ ');
                } else {
                  value = local.current[0] === null ? '' : moment(local.current[0]).format(_this.settings.format);
                }

                if (local.input === true) {
                  $super.val(value).triggerHandler('change');
                }

                if (typeof _this.settings.apply === 'function') {
                  _this.settings.apply.call($this, local.current, local);
                }
                $parent.triggerHandler('apply.' + Helper.GetClass(models.ComponentName));
              } else {
                $parent.triggerHandler('cancel.' + Helper.GetClass(models.ComponentName));
              }
            });
          }

          var $calendarBody = local.calendar.find('.' + _calendarBodyClass).empty();

          var firstDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.firstDay);
          var lastDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.lastDay);
          var firstWeekday = firstDate.weekday() - _this.settings.week;
          var lastWeekday = lastDate.weekday() - _this.settings.week;

          if (firstWeekday < 0) {
            firstWeekday += _this.settings.weeks.length;
          }

          var $unitList = [], currentFormat = [
            local.current[0] === null ? null : local.current[0].format('YYYY-MM-DD'),
            local.current[1] === null ? null : local.current[1].format('YYYY-MM-DD')
          ], minDate = _this.settings.minDate === null ? null : moment(_this.settings.minDate),
            maxDate = _this.settings.maxDate === null ? null : moment(_this.settings.maxDate);

          for (var i = 0; i < firstWeekday; i++) {
            var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), global.languages.weeks.en[i].toLowerCase()));
            $unitList.push($unit);
          }

          for (var i = local.dateManager.firstDay; i <= local.dateManager.lastDay; i++) {
            var iDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, i);
            var iDateFormat = iDate.format('YYYY-MM-DD');
            var $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</a></div>', Helper.GetSubClass('Unit'), iDate.format('YYYY-MM-DD'), i, global.languages.weeks.en[iDate.weekday()].toLowerCase()));

            if (_this.settings.enabledDates.length > 0) {
              if ($.inArray(iDateFormat, _this.settings.enabledDates) === -1) {
                $unit.addClass(Helper.GetSubClass('UnitDisabled'));
              }
            } else if (_this.settings.disabledWeekdays.length > 0 && $.inArray(iDate.weekday(), _this.settings.disabledWeekdays) !== -1) {
              $unit.addClass(Helper.GetSubClass('UnitDisabled')).addClass(Helper.GetSubClass('UnitDisabledWeekdays'));
            } else if (
              (minDate !== null && minDate.diff(iDate) > 0) ||
              (maxDate !== null && maxDate.diff(iDate) < 0)
            ) {
              $unit.addClass(Helper.GetSubClass('UnitDisabled')).addClass(Helper.GetSubClass('UnitDisabledRange'));
            } else if ($.inArray(iDateFormat, _this.settings.disabledDates) !== -1) {
              $unit.addClass(Helper.GetSubClass('UnitDisabled'));
            } else if (_this.settings.disabledRanges.length > 0) {
              var disabledRangesLength = _this.settings.disabledRanges.length;
              for (var j = 0; j < disabledRangesLength; j++) {
                var disabledRange = _this.settings.disabledRanges[j];
                var disabledRangeLength = disabledRange.length;
                if (iDate.diff(moment(disabledRange[0])) >= 0 && iDate.diff(moment(disabledRange[1])) <= 0) {
                  $unit.addClass(Helper.GetSubClass('UnitDisabled')).addClass(Helper.GetSubClass('UnitDisabledRange')).addClass(Helper.GetSubClass('UnitDisabledMultipleRange'));
                  break;
                }
              }
            }

            if (
              _this.settings.schedules.length > 0 &&
              typeof _this.settings.scheduleOptions === 'object' &&
              typeof _this.settings.scheduleOptions.colors === 'object'
            ) {
              var currentSchedules = _this.settings.schedules.filter(function (schedule) {
                return schedule.date === iDateFormat;
              });

              var nameOfSchedules = $.unique(currentSchedules.map(function (schedule, index) {
                return schedule.name;
              }).sort());

              if (nameOfSchedules.length > 0) {
                //$unit.data('schedules', currentSchedules);
                var $schedulePinContainer = $(_this.global.calendarScheduleContainerHtml);
                $schedulePinContainer.appendTo($unit);
                nameOfSchedules.map(function (name, index) {
                  if (typeof _this.settings.scheduleOptions.colors[name] !== 'undefined') {
                    var color = _this.settings.scheduleOptions.colors[name];
                    var $schedulePin = $(Helper.Format(_this.global.calendarSchedulePinHtml, name, color));
                    $schedulePin.appendTo($schedulePinContainer);
                  }
                });
              }
            }

            if (_this.settings.toggle === true) {
              if ($.inArray(iDateFormat, local.storage.activeDates) !== -1 && local.storage.activeDates.length > 0) {
                $unit.addClass(toggleActiveClass);
              } else {
                $unit.addClass(toggleInactiveClass);
              }
            } else if ($unit.hasClass(Helper.GetSubClass('UnitDisabled')) === false) {
              if (_this.settings.multiple === true) {
                if ((currentFormat[0] !== null && iDateFormat === currentFormat[0])) {
                  $unit.addClass(activeClass).addClass(activePositionClasses[0]);
                }

                if ((currentFormat[1] !== null && iDateFormat === currentFormat[1])) {
                  $unit.addClass(activeClass).addClass(activePositionClasses[1]);
                }
              } else {
                if ((currentFormat[0] !== null && iDateFormat === currentFormat[0]) &&
                  $.inArray(currentFormat[0], _this.settings.disabledDates) === -1 &&
                  (_this.settings.enabledDates.length < 1 || $.inArray(currentFormat[0], _this.settings.enabledDates) !== -1)) {
                  $unit.addClass(activeClass).addClass(activePositionClasses[0]);
                }
              }
            }

            $unitList.push($unit);
            var $super = $this;

            $unit.bind('click', function (event) {
              event.preventDefault();
              event.stopPropagation();

              var $this = $(this);
              var position = 0;
              var date = $this.data('date');
              var preventSelect = false;

              if ($this.hasClass(Helper.GetSubClass('UnitDisabled'))) {
                preventSelect = true;
              } else {
                if (local.input === true && _this.settings.multiple === false && _this.settings.buttons === false) {
                  $super.val(moment(date).format(_this.settings.format));
                  $parent.triggerHandler('apply.' + Helper.GetClass(models.ComponentName));
                } else {
                  if (
                    local.initialize !== null &&
                    local.initialize.format('YYYY-MM-DD') === date &&
                    _this.settings.toggle === false
                  ) {
                  } else {
                    if (_this.settings.toggle === true) {
                      var match = local.storage.activeDates.filter(function (e, i) {
                        return e === date;
                      });
                      local.current[position] = moment(date);
                      if (match.length < 1) {
                        local.storage.activeDates.push(date);
                        $this.addClass(toggleActiveClass).removeClass(toggleInactiveClass);
                      } else {
                        var index = 0;
                        for (var idx = 0; idx < local.storage.activeDates.length; idx++) {
                          var targetDate = local.storage.activeDates[idx];
                          if (date === targetDate) {
                            index = idx;
                            break;
                          }
                        }
                        local.storage.activeDates.splice(index, 1);
                        $this.removeClass(toggleActiveClass).addClass(toggleInactiveClass);
                      }
                    } else if (
                      $this.hasClass(activeClass) === true &&
                      _this.settings.pickWeeks === false
                    ) {
                      if (_this.settings.multiple === true) {
                        if ($this.hasClass(activePositionClasses[0])) {
                          position = 0;
                        } else if (activePositionClasses[1]) {
                          position = 1;
                        }
                      }
                      $this.removeClass(activeClass).removeClass(activePositionClasses[position]);
                      local.current[position] = null;
                    } else {
                      if (_this.settings.pickWeeks === true) {
                        if (
                          $this.hasClass(activeClass) === true ||
                          $this.hasClass(rangeClass) === true
                        ) {
                          for (var j = 0; j < 2; j++) {
                            local.calendar.find('.' + activeClass + '.' + activePositionClasses[j]).removeClass(activeClass).removeClass(activePositionClasses[j]);
                          }

                          local.current[0] = null;
                          local.current[1] = null;
                        } else {
                          local.current[0] = moment(date).startOf('week');
                          local.current[1] = moment(date).endOf('week');

                          for (var j = 0; j < 2; j++) {
                            local.calendar.find('.' + activeClass + '.' + activePositionClasses[j]).removeClass(activeClass).removeClass(activePositionClasses[j]);
                            local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('Unit'), local.current[j].format('YYYY-MM-DD'))).addClass(activeClass).addClass(activePositionClasses[j]);
                          }
                        }
                      } else {
                        if (_this.settings.multiple === true) {
                          if (local.current[0] === null) {
                            position = 0;
                          } else if (local.current[1] === null) {
                            position = 1;
                          } else {
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
                        local.current[0] !== null &&
                        local.current[1] !== null
                      ) {
                        if (local.current[0].diff(local.current[1]) > 0) {
                          var tmp = local.current[0];
                          local.current[0] = local.current[1];
                          local.current[1] = tmp;
                          tmp = null;

                          local.calendar.find('.' + activeClass).each(function () {
                            var $this = $(this);
                            for (var idx in activePositionClasses) {
                              var className = activePositionClasses[idx];
                              $this.toggleClass(className);
                            }
                          });
                        }

                        if (
                          validDateArea(local.current[0], local.current[1]) === false &&
                          _this.settings.selectOver === false
                        ) {
                          local.current[0] = null;
                          local.current[1] = null;

                          local.calendar.find('.' + activeClass).removeClass(activeClass).removeClass(activePositionClasses[0]).removeClass(activePositionClasses[1]);
                        }

                        if (local.input === true && _this.settings.buttons === false) {
                          var dateValues = []

                          if (local.current[0] !== null) {
                            dateValues.push(local.current[0].format(_this.settings.format));
                          }

                          if (local.current[1] !== null) {
                            dateValues.push(local.current[1].format(_this.settings.format));
                          }

                          $this.val(dateValues.join(', '));
                          $parent.trigger('apply.' + Helper.GetClass(models.ComponentName));
                        }
                      }
                    }

                    if (_this.settings.multiple === true) {
                      local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
                      generateDateRange.call();
                    }

                    if (_this.settings.schedules.length > 0) {
                      local.storage.schedules = _this.settings.schedules.filter(function (event) {
                        return event.date === date;
                      });
                    }
                  }
                }
              }

              var classifyDate = function (date) {
                local.date.all.push(date);
                if (validDate(moment(date))) {
                  local.date.enabled.push(date);
                } else {
                  local.date.disabled.push(date);
                }
              };

              if (local.current[0] !== null) {
                if (local.current[1] !== null) {
                  var startDate = local.current[0];
                  var date = startDate.clone();
                  for (; date.format('YYYY-MM-DD') <= local.current[1].format('YYYY-MM-DD'); date.add('1', 'days')) {
                    classifyDate(date.clone());
                  }
                } else {
                  var date = local.current[0];
                  classifyDate(date.clone());
                }
              }

              if (preventSelect === false) {
                local.initialize = null;

                if (typeof _this.settings.select === 'function') {
                  _this.settings.select.call($this, local.current, local);
                }
              }

              if (typeof _this.settings.click === 'function') {
                _this.settings.click.call($this, event, local);
              }
            });
          }

          for (var i = lastWeekday + 1; $unitList.length < _this.settings.weeks.length * 5; i++) {
            if (i < 0) {
              i = global.languages.weeks.en.length - i;
            }
            var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), global.languages.weeks.en[i % global.languages.weeks.en.length].toLowerCase()));
            $unitList.push($unit);
          }

          var $row = null;
          var unitListLen = $unitList.length;
          for (var i = 0; i < unitListLen; i++) {
            var e = $unitList[i];
            if (i % _this.settings.weeks.length == 0 || i + 1 >= unitListLen) {
              if ($row !== null) {
                $row.appendTo($calendarBody);
              }

              if (i + 1 < unitListLen) {
                $row = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Row')));
              }
            }
            $row.append(e);
          }

          local.calendar.find('.' + _calendarTopClass + '-nav').bind('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var $this = $(this);
            if ($this.hasClass(_calendarTopClass + '-prev')) {
              local.dateManager = new DateManager(local.dateManager.date.clone().add(-1, 'months'));
              local.renderer.call();
            }
            else if ($this.hasClass(_calendarTopClass + '-next')) {
              local.dateManager = new DateManager(local.dateManager.date.clone().add(1, 'months'));
              local.renderer.call();
            }
          });

          if (_this.settings.multiple === true) {
            local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
            generateDateRange.call();
          }
        };
        local.renderer.call();
        $this[0][models.ComponentName] = local;
      });
    },
    setting: function (options) {
      var settings = $.extend({
        language: global.language,
        languages: {},
        week: null,
        format: null
      }, options);

      var monthsCount = 12;
      var weeksCount = 7;

      global.language = settings.language;

      if (Object.keys(settings.languages).length > 0) {
        for (var idx in settings.languages) {
          var language = settings.languages[idx];

          if (typeof idx !== 'string') {
            console.error('Global configuration is failed.\nMessage: language key is not a string type.', idx);
          }

          if (typeof language.weeks === 'undefined') {
            console.error('Global configuration is failed.\nMessage: You must give `weeks` option of `' + idx + '` language.');
            break;
          }

          if (typeof language.monthsLong === 'undefined') {
            console.error('Global configuration is failed.\nMessage: You must give `monthsLong` option of `' + idx + '` language.');
            break;
          }

          if (typeof language.months === 'undefined') {
            console.error('Global configuration is failed.\nMessage: You must give `months` option of `' + idx + '` language.');
            break;
          }

          if (language.weeks.length < weeksCount) {
            console.error('`weeks` must have least ' + weeksCount + ' items.');
            break;
          } else if (language.weeks.length !== weeksCount) {
            console.warn('`weeks` option over ' + weeksCount + ' items. We recommend to give ' + weeksCount + ' items.');
          }

          if (language.monthsLong.length < monthsCount) {
            console.error('`monthsLong` must have least ' + monthsCount + ' items.');
            break;
          } else if (language.monthsLong.length !== monthsCount) {
            console.warn('`monthsLong` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
          }

          if (language.months.length < monthsCount) {
            console.error('`months` must have least ' + monthsCount + ' items.');
            break;
          } else if (language.months.length !== monthsCount) {
            console.warn('`months` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
          }

          if (global.languages.supports.indexOf(settings.language) === -1) {
            global.languages.supports.push(settings.language);
          }

          ['weeks', 'monthsLong', 'months'].map(function (key) {
            if (typeof global.languages[key][idx] !== 'undefined') {
              console.warn('`' + idx + '` language is already given however it will be overwriten.');
            }
            global.languages[key][idx] = language[key];
          });
        }
      }

      if (settings.week !== null) {
        if (typeof settings.week === 'number') {
          global.week = settings.week;
        } else {
          console.error('Global configuration is failed.\nMessage: You must give `week` option as number type.');
        }
      }

      if (settings.format !== null) {
        if (typeof settings.format === 'string') {
          global.format = settings.format;
        } else {
          console.error('Global configuration is failed.\nMessage: You must give `format` option as string type.');
        }
      }
    },
    configure: function (options) {
      var _this = this;

      this.settings = $.extend({
        lang: global.language,
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
         * CALLBACK
         *******************************************/
        select: null,
        apply: null,
        click: null
      }, options);

      if (this.settings.lang !== 'en' &&
        $.inArray(this.settings.lang, global.languages.supports) !== -1) {
        this.settings.weeks = global.languages.weeks[this.settings.lang];
        this.settings.monthsLong = global.languages.monthsLong[this.settings.lang];
        this.settings.months = global.languages.months[this.settings.lang];
      }

      if (this.settings.theme !== 'light' &&
        $.inArray(this.settings.theme, models.ComponentPreference.supports.themes) === -1) {
        this.settings.theme = 'light';
      }

      if (this.settings.pickWeeks === true) {
        if (this.settings.multiple === false) {
          console.error('You must give true at settings.multiple options on PIGNOSE-Calendar for using in pickWeeks option.');
        } else if (this.settings.toggle === true) {
          console.error('You must give false at settings.toggle options on PIGNOSE-Calendar for using in pickWeeks option.');
        }
      }

      this.settings.week %= this.settings.weeks.length;
    },
    set: function (date) {
      if (typeof date !== 'undefined' && date !== null && date !== '') {
        var dateSplit = date.split('~').map(function (e) {
          var f = $.trim(e);
          return (f === 'null' || f === '') ? null : f;
        });

        this.each(function () {
          var $this = $(this);
          var local = $this[0][models.ComponentName];
          var context = local.context;

          var dateArray = [
            (typeof dateSplit[0] === 'undefined' || dateSplit[0] === null) ? null : moment(dateSplit[0], context.settings.format),
            (typeof dateSplit[1] === 'undefined' || dateSplit[1] === null) ? null : moment(dateSplit[1], context.settings.format)
          ];
          local.dateManager = new DateManager(dateArray[0]);

          if (context.settings.pickWeeks === true) {
            if (dateArray[0] !== null) {
              var date = dateArray[0];
              dateArray[0] = date.clone().startOf('week');
              dateArray[1] = date.clone().endOf('week');
            }
          }

          if (context.settings.toggle === true) {
            local.storage.activeDates = dateSplit;
          } else {
            local.current = dateArray;
          }
          local.renderer.call();
        });
      }
    },
    select: function (day) {
      this.each(function () {
        var local = this.local;
        var dateManager = local.dateManager;
        var date = Helper.Format('{0}-{1}-{2}', dateManager.year, dateManager.month, day);
        $(this).find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('Unit'), date)).triggerHandler('click');
      });
    }
  };

  return Component;
});
