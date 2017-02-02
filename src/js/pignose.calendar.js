/************************************************************************************************************
 *
 * @ PIGNOSE Calendar
 * @ Date Feb 02. 2017
 * @ Author PIGNOSE
 * @ Licensed under MIT.
 *
 ***********************************************************************************************************/

var ComponentName = 'pignoseCalendar';
var ComponentVersion = '1.4.3';

window[ComponentName] = {
	VERSION: ComponentVersion
};

/************************************************************************************************************
 *
 * @ Version 1.0.2
 * @ PIGNOSE PLUGIN HELPER
 * @ Date Nev 05. 2016
 * @ Author PIGNOSE
 * @ Licensed under MIT.
 *
 ***********************************************************************************************************/
var DateManager = (function() {
	var m_dateCache = {};
	var DateManager = function Constructor(d) {
		this.year = parseInt(d.format('YYYY'), 10);
		this.month = parseInt(d.format('MM'), 10);
		this.prevMonth = parseInt(d.clone().add(-1, 'months').format('MM'), 10);
		this.nextMonth = parseInt(d.clone().add(1, 'months').format('MM'), 10);
		this.day = parseInt(d.format('DD'), 10);
		this.firstDay = 1;
		this.lastDay = parseInt(d.clone().endOf('month').format('DD'), 10);
		this.weekDay = d.weekday();
		this.date = d;
	};

	DateManager.prototype.toString = function() {
		return this.date.format('YYYY-MM-DD');
	};

	DateManager.Convert = function(year, month, day) {
		var date = Helper.Format('{0}-{1}-{2}', year, month, day);
		if(typeof m_dateCache[date] === 'undefined') {
			m_dateCache[date] = moment(date, 'YYYY-MM-DD');
		}
		return m_dateCache[date];
	};

	return DateManager
}) ();

var Helper = (function() {
	var m_formatCache = {};
	var m_classCache = {};
	var m_subClassCache = {};

	var m_regex_upper = /[A-Z]/;

	var Helper = function Constructor() {
	};

	Helper.Format = function(format) {
		if(typeof format === 'undefined' || format === '' || arguments.length <= 1) {
			return '';
		} else {
			var args = Array.prototype.slice.call(arguments, 1);
			var key = format + args.join('');
			if(typeof m_formatCache[key] !== 'undefined') {
				return m_formatCache[key]
			} else {
				var len = args.length;
				for(var idx=0; idx<len; idx++) {
					var value = args[idx];
					format = format.replace(new RegExp(('((?!\\\\)?\\{' + idx + '(?!\\\\)?\\})'), 'g'), value);
				}
			}
		}
		m_formatCache[key] = format;
		return format;
	};

	Helper.GetClass = function(name) {
		var key = ComponentName + name;
		if(typeof m_classCache[key] !== 'undefined') {
			return m_classCache[key];
		} else {
			var chars = name.split('');
			var classNames = [], className;
			var len = chars.length;
			for(var idx=0, pos=0; idx<len; idx++) {
				var char = chars[idx];
				if(typeof char !== 'string') {
					continue;
				}

				if(m_regex_upper.test(char) === true) {
					classNames[pos++] = '-';
					char = char.toString().toLowerCase();
				}
				classNames[pos++] = char;
			}

			className = classNames.join('');
			m_classCache[key] = className;
			return className;
		}
	};

	Helper.GetSubClass = function(name) {
		if(typeof m_subClassCache[name] === 'undefined') {
			m_subClassCache[name] = Helper.GetClass(Helper.Format('{0}{1}', ComponentName, name));
		}
		return m_subClassCache[name];
	};

	return Helper;
}) ();


/************************************************************************************************************
 *
 * @ Helper's polyfills
 *
 ***********************************************************************************************************/

if(typeof Array.prototype.filter === 'undefined') {
	Array.prototype.filter = function(func) {
		'use strict';
		if (this == null) {
		  throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;

		if (typeof func !== 'function') {
			return [];
		}

		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i<len; i++) {
			if (i in t) {
				var val = t[i];
				if (func.call(thisp, val, i, t)) {
					res.push(val);
				}
			}
		}
		return res;
	};
}

/************************************************************************************************************
 *
 * @ Component define region.
 *
 ***********************************************************************************************************/

var ComponentClass = Helper.GetClass(ComponentName);
var ComponentPreference = {
	supports: {
		themes: ['light', 'dark']
	}
};
(function($) {
	'use strict';
	var $window = $(window);
	var $document = $(document);

	var _calendarTopClass = Helper.GetSubClass('Top');
	var _calendarHeaderClass = Helper.GetSubClass('Header');
	var _calendarBodyClass = Helper.GetSubClass('Body');
	var _calendarButtonClass = Helper.GetSubClass('Button');

	var languagePack = {
		supports: ['en', 'ko', 'fr', 'ch', 'de', 'jp', 'pt', 'da', 'pl', 'es'],
		weeks: {
			en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			ko: ['일', '월', '화', '수', '목', '금', '토'],
			fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
			ch: ['日', '一', '二', '三', '四', '五', '六'],
			de: ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'],
			jp: ['日', '月', '火', '水', '木', '金', '土'],
			pt: ['Dom','Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
			da: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
			pl: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],
			es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
		},
		monthsLong: {
			en: ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'],
			ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
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
			fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
			ch: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			de: ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
			jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
 			pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
			da: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
			pl: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
			es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
		}
	};

	$.fn[ComponentName] = function(options) {
		var Component = {
			init : function(options) {
				var _this = this;
				this.settings = $.extend({
					lang: 'en',
					theme: 'light',
					date: moment(),
					format: 'YYYY-MM-DD',
					classOnDays: [],
					enabledDates: [],
					disabledDates: [],
					disabledWeekdays: [],
					disabledRanges: [],
					weeks: languagePack.weeks.en,
					monthsLong: languagePack.monthsLong.en,
					months: languagePack.months.en,
					pickWeeks: false,
					initialize: true,
					multiple: false,
					toggle: false,
					reverse: false,
					buttons: false,
					modal: false,
					minDate: null,
					maxDate: null,

					/********************************************
					 * CALLBACK
					 *******************************************/
					select: null,
					apply: null
				}, options);

				if(this.settings.lang !== 'en' &&
				   $.inArray(this.settings.lang, languagePack.supports) !== -1) {
					this.settings.weeks = languagePack.weeks[this.settings.lang];
					this.settings.monthsLong = languagePack.monthsLong[this.settings.lang];
					this.settings.months = languagePack.months[this.settings.lang];
				}

				if(this.settings.theme !== 'light' &&
				   $.inArray(this.settings.theme, ComponentPreference.supports.themes) === -1) {
				   this.settings.theme = 'light';
				}

				if(this.settings.pickWeeks === true) {
					if(this.settings.multiple === false) {
						console.error('You must give true at settings.multiple options on PIGNOSE-Calendar for using in pickWeeks option.');
					} else if(this.settings.toggle === true) {
						console.error('You must give false at settings.toggle options on PIGNOSE-Calendar for using in pickWeeks option.');
					}
				}

				this.global = {
					calendarHtml: Helper.Format('<div class="{0} {0}-{4}">\
													<div class="{1}">\
														<a href="#" class="{1}-nav {1}-prev">\
															<span class="{1}-icon"></span>\
															<span class="{1}-value"></span>\
														</a>\
														<div class="{1}-date">\
															<p class="{1}-month"></p>\
															<h3 class="{1}-year"></h3>\
														</div>\
														<a href="#" class="{1}-nav {1}-next">\
															<span class="{1}-value"></span>\
															<span class="{1}-icon"></span>\
														</a>\
													</div>\
													<div class="{2}"></div>\
													<div class="{3}"></div>\
												</div>', ComponentClass, _calendarTopClass, _calendarHeaderClass, _calendarBodyClass, _this.settings.theme),
					calendarButtonsHtml: Helper.Format('<div class="{0}-group">\
															<a href="#" class="{0} {0}-cancel">Cancel</a>\
															<a href="#" class="{0} {0}-apply">OK</a>\
														</div>', _calendarButtonClass)
				};

				var rangeClass = Helper.GetSubClass('UnitRange');
				var rangeFirstClass = Helper.GetSubClass('UnitRangeFirst');
				var rangeLastClass = Helper.GetSubClass('UnitRangeLast');
				var activeClass = Helper.GetSubClass('UnitActive');
				var activePositionClasses = [Helper.GetSubClass('UnitFirstActive'), Helper.GetSubClass('UnitSecondActive')];
				var toggleActiveClass = Helper.GetSubClass('UnitToggleActive');
				var toggleInactiveClass = Helper.GetSubClass('UnitToggleInactive');

				return this.each(function() {
					var $this = $(this);
					var $super = $this;
					var $parent = $this;
					var local = {
						initialize: null,
						calendar: $(_this.global.calendarHtml),
						input: $this.is('input'),
						renderer: null,
						current: [null, null],
						storage: {
							activeDates: []
						},
						dateManager: new DateManager(_this.settings.date),
						calendarWrapperHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Wrapper')),
						calendarWrapperOverlayHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('WrapperOverlay')),
						context: _this
					};
					var len;

					if(_this.settings.initialize === true) {
						local.initialize = local.current[0] = local.dateManager.date.clone();
					}

					this.local = local;

					if(_this.settings.reverse === true) {
						local.calendar.addClass(Helper.GetSubClass('Reverse'));
					} else {
						local.calendar.addClass(Helper.GetSubClass('Default'));
					}
					
					len = _this.settings.weeks.length;
					for(var idx=0; idx<len; idx++) {
						var week = _this.settings.weeks[idx];
						if(typeof week !== 'string') {
							continue;
						}
						week = week.toUpperCase();
						var $unit = $(Helper.Format('<div class="{0} {0}-{2}">{1}</div>', Helper.GetSubClass('Week'), week, languagePack.weeks.en[idx].toLowerCase()));
						$unit.appendTo(local.calendar.find('.' + _calendarHeaderClass));
					}

					if(_this.settings.buttons === true) {
						var $calendarButton = $(_this.global.calendarButtonsHtml);
						$calendarButton.appendTo(local.calendar);
					}

					if(local.input === true || _this.settings.modal === true) {
						var wrapperActiveClass = Helper.GetSubClass('WrapperActive');
						var overlayActiveClass = Helper.GetSubClass('WrapperOverlayActive');
						var $overlay = $('.' + Helper.GetSubClass('WrapperOverlay'));
						if($overlay.length < 1) {
							$overlay = $(local.calendarWrapperOverlayHtml);
							$overlay.appendTo('body').hide();
						}

						$parent = $(local.calendarWrapperHtml);
						$parent.appendTo('body');
						$parent.bind('click', function(event) {
							event.stopPropagation();
						});

						$this
							.bind('click', function(event) {
								event.preventDefault();
								event.stopPropagation();
								event.stopImmediatePropagation();
								setTimeout(function() {
									$overlay.show();
									$parent.show();
									$window.unbind('resize.' + ComponentClass).bind('resize.' + ComponentClass, function() {
										$parent.css({
											marginLeft: - $parent.outerWidth() / 2,
											marginTop: - $parent.outerHeight() / 2
										});
									}).triggerHandler('resize.' + ComponentClass);
									$super[ComponentName]('set', $this.val());
									setTimeout(function() {
										$overlay.addClass(overlayActiveClass);
										$parent.addClass(wrapperActiveClass);
									}, 25);
								}, 25);
							})
							.bind('focus', function(event) {
								var $this = $(this);
								$this.blur();
							});

						$overlay.bind('click.' + ComponentClass, function() {
							$parent.trigger('cancel.' + ComponentClass);
						});

						$parent.unbind('cancel.' + ComponentClass + ' ' + 'apply.' + ComponentClass).bind('cancel.' + ComponentClass + ' ' + 'apply.' + ComponentClass, function() {
							$overlay.removeClass(overlayActiveClass).hide();
							$parent.removeClass(wrapperActiveClass).hide();
						});
					}

					var generateDateRange = function() {
						if(local.current[0] === null || local.current[1] === null) {
							return false;
						}
						var firstSelectDate = local.current[0].format('YYYY-MM-DD');
						var lastSelectDate = local.current[1].format('YYYY-MM-DD');
						var firstDate = moment(Math.max(local.current[0].valueOf(), local.dateManager.date.clone().startOf('month').valueOf()));
						var lastDate = moment(Math.min(local.current[1].valueOf(), local.dateManager.date.clone().endOf('month').valueOf()));
						var firstDateIsUndered = (firstDate.format('YYYY-MM-DD') !== firstSelectDate);
						var lastDateIsOvered = (lastDate.format('YYYY-MM-DD') !== lastSelectDate);

						if(firstDateIsUndered === false) {
							firstDate.add(1, 'days');
						}

						if(lastDateIsOvered === false) {
							lastDate.add(-1, 'days');
						}

						var firstDateFixed = firstDate.format('YYYY-MM-DD');
						var lastDateFixed = lastDate.format('YYYY-MM-DD');

						for(; firstDate.format('YYYY-MM-DD') <= lastDate.format('YYYY-MM-DD'); firstDate.add(1, 'days')) {
							var date = firstDate.format('YYYY-MM-DD');
							var isRange = true;
							var $target = local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('Unit'), date)).addClass(rangeClass);

							if(date === firstDateFixed) {
								$target.addClass(rangeFirstClass);
							}
							
							if(date === lastDateFixed) {
								$target.addClass(rangeLastClass);
							}
						}
					};

					local.renderer = function() {
						local.calendar.appendTo($parent.empty());
						local.calendar.find('.' + _calendarTopClass + '-year').text(local.dateManager.year);
						local.calendar.find('.' + _calendarTopClass + '-month').text(_this.settings.monthsLong[local.dateManager.month - 1]);
						local.calendar.find(Helper.Format('.{0}-prev .{0}-value', _calendarTopClass)).text(_this.settings.months[local.dateManager.prevMonth - 1].toUpperCase());
						local.calendar.find(Helper.Format('.{0}-next .{0}-value', _calendarTopClass)).text(_this.settings.months[local.dateManager.nextMonth - 1].toUpperCase());

						if(_this.settings.buttons === true) {
							$calendarButton.find('.' + _calendarButtonClass).bind('click', function(event) {
								event.preventDefault();
								event.stopPropagation();
								var $this = $(this);
								if($this.hasClass(_calendarButtonClass + '-apply')) {
									$super.trigger('apply.' + ComponentName, local);
									var value = ''
									if(_this.settings.toggle === true) {
										value = local.storage.activeDates.join(', ');
									} else if(_this.settings.multiple === true) {
										var dateValues = [];

										if(local.current[0] !== null) {
											dateValues.push(local.current[0].format(_this.settings.format));
										}

										if(local.current[1] !== null) {
											dateValues.push(local.current[1].format(_this.settings.format));
										}

										value = dateValues.join(' ~ ');
									} else {
										value = local.current[0] === null? '':moment(local.current[0]).format(_this.settings.format);
									}
									if(local.input === true) {
										$super.val(value).triggerHandler('change');
									}
									if(typeof _this.settings.apply === 'function') {
										_this.settings.apply.call($super, value);
									}
									$parent.triggerHandler('apply.' + ComponentClass);
								} else {
									$parent.triggerHandler('cancel.' + ComponentClass);
								}
							});
						}

						var $calendarBody = local.calendar.find('.' + _calendarBodyClass).empty();

						var firstDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.firstDay);
						var firstWeekday = firstDate.weekday();
						var $unitList = [], currentFormat = [
								local.current[0] === null? null:local.current[0].format('YYYY-MM-DD'),
								local.current[1] === null? null:local.current[1].format('YYYY-MM-DD')
							], minDate = _this.settings.minDate === null? null:moment(_this.settings.minDate),
							   maxDate = _this.settings.maxDate === null? null:moment(_this.settings.maxDate);

						for(var i=0; i<firstWeekday; i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), languagePack.weeks.en[i].toLowerCase()));
							$unitList.push($unit);
						}

						for(var i=local.dateManager.firstDay; i<=local.dateManager.lastDay; i++) {
							var iDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, i);
							var iDateFormat = iDate.format('YYYY-MM-DD');
							var $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</a></div>', Helper.GetSubClass('Unit'), iDate.format('YYYY-MM-DD'), i, languagePack.weeks.en[iDate.weekday()].toLowerCase()));

							if(_this.settings.enabledDates.length > 0) {
								if($.inArray(iDateFormat, _this.settings.enabledDates) === -1) {
									$unit.addClass(Helper.GetSubClass('UnitDisabled'));
								}
							} else if(_this.settings.disabledWeekdays.length > 0 && $.inArray(iDate.weekday(), _this.settings.disabledWeekdays) !== -1) {
								$unit.addClass(Helper.GetSubClass('UnitDisabled')).addClass(Helper.GetSubClass('UnitDisabledWeekdays'));
							} else if(
								(minDate !== null && minDate.diff(iDate) > 0) ||
								(maxDate !== null && maxDate.diff(iDate) < 0)
							) {
								$unit.addClass(Helper.GetSubClass('UnitDisabled')).addClass(Helper.GetSubClass('UnitDisabledRange'));
							} else if($.inArray(iDateFormat, _this.settings.disabledDates) !== -1) {
								$unit.addClass(Helper.GetSubClass('UnitDisabled'));
							} else if(_this.settings.disabledRanges.length > 0) {
								var disabledRangesLength = _this.settings.disabledRanges.length;
								for(var j=0; j<disabledRangesLength; j++) {
									var disabledRange = _this.settings.disabledRanges[j];
									var disabledRangeLength = disabledRange.length;
									if(iDate.diff(moment(disabledRange[0])) >= 0 && iDate.diff(moment(disabledRange[1])) <= 0) {
										$unit.addClass(Helper.GetSubClass('UnitDisabled')).addClass(Helper.GetSubClass('UnitDisabledRange')).addClass(Helper.GetSubClass('UnitDisabledMultipleRange'));
										break;
									}
								}
							}

							if(_this.settings.toggle === true) {
								if($.inArray(iDateFormat, local.storage.activeDates) !== -1 && local.storage.activeDates.length > 0) {
								   $unit.addClass(toggleActiveClass);
								} else {
									$unit.addClass(toggleInactiveClass);
								}
							} else if($unit.hasClass(Helper.GetSubClass('UnitDisabled')) === false) {
								if(_this.settings.multiple === true) {
									if((currentFormat[0] !== null && iDateFormat === currentFormat[0])) {
										$unit.addClass(activeClass).addClass(activePositionClasses[0]);
									}
									
									if((currentFormat[1] !== null && iDateFormat === currentFormat[1])) {
										$unit.addClass(activeClass).addClass(activePositionClasses[1]);
									}
								} else {
									if((currentFormat[0] !== null && iDateFormat === currentFormat[0]) &&
										$.inArray(currentFormat[0], _this.settings.disabledDates) === -1 &&
										(_this.settings.enabledDates.length < 1 || $.inArray(currentFormat[0], _this.settings.enabledDates) !== -1)) {
										$unit.addClass(activeClass).addClass(activePositionClasses[0]);
									}
								}
							}

							$unitList.push($unit);
							$unit.bind('click', function(event) {
								event.preventDefault();
								event.stopPropagation();

								var $this = $(this);
								var position = 0;
								var date = $this.data('date');

								if($this.hasClass(Helper.GetSubClass('UnitDisabled'))) {
									return false;
								}

								if(local.input === true && _this.settings.multiple === false && _this.settings.buttons === false) {
									$super.val(moment(date).format(_this.settings.format));
									$parent.triggerHandler('apply.' + ComponentClass);
									return false;
								}

								if(
									local.initialize !== null &&
									local.initialize.format('YYYY-MM-DD') === date &&
									_this.settings.toggle === false
								) {
								} else {
									if(_this.settings.toggle === true) {
										var match = local.storage.activeDates.filter(function(e, i) {
											return e === date;
										});
										local.current[position] = moment(date);
										if(match.length < 1) {
											local.storage.activeDates.push(date);
											$this.addClass(toggleActiveClass).removeClass(toggleInactiveClass);
										} else {
											var index = 0;
											for(var idx=0; idx<local.storage.activeDates.length; idx++) {
												var targetDate = local.storage.activeDates[idx];
												if(date === targetDate) {
													index = idx;
													break;
												}
											}
											local.storage.activeDates.splice(index, 1);
											$this.removeClass(toggleActiveClass).addClass(toggleInactiveClass);
										}
									} else {
										if(
											$this.hasClass(activeClass) === true &&
											_this.settings.pickWeeks === false
										) {
											if(_this.settings.multiple === true) {
												if($this.hasClass(activePositionClasses[0])) {
													position = 0;
												} else if(activePositionClasses[1]) {
													position = 1;
												}
											}
											$this.removeClass(activeClass).removeClass(activePositionClasses[position]);
											local.current[position] = null;
										} else {
											if(_this.settings.pickWeeks === true) {
												if(
													$this.hasClass(activeClass) === true ||
													$this.hasClass(rangeClass) === true
												) {
													for(var j=0; j<2; j++) {
														local.calendar.find('.' + activeClass + '.' + activePositionClasses[j]).removeClass(activeClass).removeClass(activePositionClasses[j]);
													}

													local.current[0] = null;
													local.current[1] = null;
												} else {
													local.current[0] = moment(date).startOf('week');
													local.current[1] = moment(date).endOf('week');

													for(var j=0; j<2; j++) {
														local.calendar.find('.' + activeClass + '.' + activePositionClasses[j]).removeClass(activeClass).removeClass(activePositionClasses[j]);
														local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('Unit'), local.current[j].format('YYYY-MM-DD'))).addClass(activeClass).addClass(activePositionClasses[j]);
													}
												}
											} else {
												if(_this.settings.multiple === true) {
													if(local.current[0] === null) {
														position = 0;
													} else if(local.current[1] === null) {
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

											if(_this.settings.multiple === true) {
												local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
											}

											if(_this.settings.multiple === true &&
											   local.current[0] !== null &&
											   local.current[1] !== null) {
												if(local.current[0].diff(local.current[1]) > 0) {
													var tmp = local.current[0];
													local.current[0] = local.current[1];
													local.current[1] = tmp;
													tmp = null;

													local.calendar.find('.' + activeClass).each(function() {
														var $this = $(this);
														for(var idx in activePositionClasses) {
															var className = activePositionClasses[idx];
															$this.toggleClass(className);
														}
													});
												}

												if(local.input === true && _this.settings.buttons === false) {
													var dateValues = []

													if(local.current[0] !== null) {
														dateValues.push(local.current[0].format(_this.settings.format));
													}

													if(local.current[1] !== null) {
														dateValues.push(local.current[1].format(_this.settings.format));
													}

													$super.val(dateValues.join(', '));
													$parent.trigger('apply.' + ComponentClass); 
												}

												generateDateRange.call();
											}
										}
									}
								}
								local.initialize = null;

								if(typeof _this.settings.select === 'function') {
									_this.settings.select.call($this, local.current, local);
								}
							});
						}

						var lastDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.lastDay);
						var lastWeekday = lastDate.weekday();

						for(var i=lastWeekday+1;$unitList.length <= 7 * 5;i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), languagePack.weeks.en[i % 7].toLowerCase()));
							$unitList.push($unit);
						}

						var $row = null;
						var unitListLen = $unitList.length;
						for(var i=0; i<unitListLen; i++) {
							var e = $unitList[i];
							if(i % 7 == 0 || i + 1 >= unitListLen) {
								if($row !== null) {
									$row.appendTo($calendarBody);
								}

								if(i + 1 < unitListLen) {
									$row = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Row')));
								}
							}
							$row.append(e);
						}

						local.calendar.find('.' + _calendarTopClass + '-nav').bind('click', function(event) {
							event.preventDefault();
							event.stopPropagation();
							var $this = $(this);
							if($this.hasClass(_calendarTopClass + '-prev')) {
								local.dateManager = new DateManager(local.dateManager.date.clone().add(-1, 'months'));
								local.renderer.call();
							}
							else if($this.hasClass(_calendarTopClass + '-next')) {
								local.dateManager = new DateManager(local.dateManager.date.clone().add(1, 'months'));
								local.renderer.call();
							}
						});

						if(_this.settings.multiple === true) {
							local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
							generateDateRange.call();
						}
					};
					local.renderer.call();
					$this[0][ComponentName] = local;
				});
			},
			set: function(date) {
				if(typeof date !== 'undefined' && date !== null && date !== '') {
					var dateSplit = date.split('~').map(function(e) {
						var f = $.trim(e);
						return (f === 'null' || f === '')? null:f;
					});

					this.each(function() {
						var $this = $(this);
						var local = $this[0][ComponentName];
						var context = local.context;

						var dateArray = [
							(typeof dateSplit[0] === 'undefined' || dateSplit[0] === null)? null:moment(dateSplit[0], context.settings.format),
							(typeof dateSplit[1] === 'undefined' || dateSplit[1] === null)? null:moment(dateSplit[1], context.settings.format)
						];
						local.dateManager = new DateManager(dateArray[0]);

						if(context.settings.pickWeeks === true) {
							if(dateArray[0] !== null) {
								var date = dateArray[0];
								dateArray[0] = date.clone().startOf('week');
								dateArray[1] = date.clone().endOf('week');
								console.log(dateArray);
							}
						}

						if(context.settings.toggle === true) {
							local.storage.activeDates = dateSplit;
						} else {
							local.current = dateArray;
						}
						local.renderer.call();
					});
				}
			},
			select: function(day) {
				this.each(function() {
					var local = this.local;
					var dateManager = local.dateManager;
					var date = Helper.Format('{0}-{1}-{2}', dateManager.year, dateManager.month, day);
					$(this).find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('Unit'), date)).triggerHandler('click');
				});
			}
		};

		if(Component[options]) {
			return Component[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof options === 'object' || !options) {
			return Component.init.apply(this, arguments);
		} else {
			console.error('Argument error are occured.');
		}
	};
})(jQuery);