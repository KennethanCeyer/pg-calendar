/************************************************************************************************************
 *
 * @ PIGNOSE Calendar
 * @ Date Oct 22. 2016
 * @ Author PIGNOSE
 * @ Licensed under MIT.
 *
 ***********************************************************************************************************/

var ComponentName = 'pignoseCalendar';
var ComponentVersion = '1.2.11';

window[ComponentName] = {
	VERSION: ComponentVersion
};

/************************************************************************************************************
 *
 * @ Version 1.0.1
 * @ PIGNOSE PLUGIN HELPER
 * @ Date Oct 08. 2016
 * @ Author PIGNOSE
 * @ Licensed under MIT.
 *
 ***********************************************************************************************************/
function DateManager(d) {
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
	return moment(date, 'YYYY-MM-DD');
};

function Helper() {
};

!(function() {
	var m_formatCache = {};
	var m_classCache = {};
	Helper.Format = function(format) {
		if(typeof format === 'undefined' || format === '' || arguments.length <= 1) {
			return '';
		} else {
			var args = Array.prototype.slice.call(arguments, 1);
			var key = format + args.join('');
			if(typeof m_formatCache[key] !== 'undefined') {
				return m_formatCache[key]
			} else {
				for(var idx in args) {
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
			var className = '';
			for(var idx in chars) {
				var char = chars[idx];
				if(typeof char !== 'string') {
					continue;
				}

				if(/[A-Z]/.test(char) === true) {
					className += '-';
					char = char.toString().toLowerCase();
				}
				className += char.toString();
			}
			m_classCache[key] = className;
			return className;
		}
	};

	Helper.GetSubClass = function(name) {
		return Helper.GetClass(Helper.Format('{0}{1}', ComponentName, name));
	};
} ());

/************************************************************************************************************
 *
 * @ Helper's folyfills
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
				var val = t[i]; // in case fun mutates this
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
		supports: ['en', 'ko', 'fr', 'ch', 'de', 'jp'],
		weeks: {
			en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			ko: ['일', '월', '화', '수', '목', '금', '토'],
			fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
			ch: ['日', '月', '火', '水', '木', '金', '土'],
			de: ['Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam', 'Son'],
			jp: ['日', '月', '火', '水', '木', '金', '土'],
		},
		monthsLong: {
			en: ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'],
			ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
			ch: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			de: ['Jänner', 'Feber', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
			jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		},
		months: {
			en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
			ch: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			de: ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
			jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
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
					enabledDates: [],
					disabledDates: [],
					weeks: languagePack.weeks.en,
					monthsLong: languagePack.monthsLong.en,
					months: languagePack.months.en,
					multiple: false,
					toggle: false,
					reverse: false,
					buttons: false,
					modal: false,

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
						initial: null,
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
					local.initial = local.current[0] = local.dateManager.date.clone();
					this.local = local;

					if(_this.settings.reverse === true) {
						local.calendar.addClass(Helper.GetSubClass('Reverse'));
					} else {
						local.calendar.addClass(Helper.GetSubClass('Default'));
					}

					for(var idx in _this.settings.weeks) {
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
									var value = null
									if(_this.settings.toggle === true) {
										value = local.storage.activeDates.join(', ');
									} else if(_this.settings.multiple === true) {
										value = (local.current[0] === null? null:local.current[0].format(_this.settings.format)) + ', ' +
												(local.current[1] === null? null:local.current[1].format(_this.settings.format));
									} else {
										value = local.current[0] === null? null:moment(local.current[0]).format(_this.settings.format);
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
						var $unitList = $();

						for(var i=0; i<firstWeekday; i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), languagePack.weeks.en[i].toLowerCase()));
							$unitList = $unitList.add($unit);
						}

						for(var i=local.dateManager.firstDay; i<=local.dateManager.lastDay; i++) {
							var iDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, i);
							var iDateFormat = iDate.format('YYYY-MM-DD');
							var $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</a></div>', Helper.GetSubClass('Unit'), iDate.format('YYYY-MM-DD'), i, languagePack.weeks.en[iDate.weekday()].toLowerCase()));

							if(_this.settings.enabledDates.length > 0 && $.inArray(iDateFormat, _this.settings.enabledDates) === -1) {
								$unit.addClass(Helper.GetSubClass('UnitDisabled'));
							} else if(_this.settings.enabledDates.length < 1 && $.inArray(iDateFormat, _this.settings.disabledDates) !== -1) {
								$unit.addClass(Helper.GetSubClass('UnitDisabled'));
							}

							if(_this.settings.toggle === true) {
								if($.inArray(iDateFormat, local.storage.activeDates) !== -1 && local.storage.activeDates.length > 0) {
								   $unit.addClass(toggleActiveClass);
								} else {
									$unit.addClass(toggleInactiveClass);
								}
							} else if (_this.settings.multiple === true) {
								if((local.current[0] !== null && iDateFormat === local.current[0].format('YYYY-MM-DD'))) {
									$unit.addClass(activeClass).addClass(activePositionClasses[0]);
								}
								
								if((local.current[1] !== null && iDateFormat === local.current[1].format('YYYY-MM-DD'))) {
									$unit.addClass(activeClass).addClass(activePositionClasses[1]);
								}
							} else {
								if((local.current[0] !== null && iDateFormat === local.current[0].format('YYYY-MM-DD')) &&
									$.inArray(local.current[0].format('YYYY-MM-DD'), _this.settings.disabledDates) === -1 &&
									(_this.settings.enabledDates.length < 1 || $.inArray(local.current[0].format('YYYY-MM-DD'), _this.settings.enabledDates) !== -1)) {
									$unit.addClass(activeClass).addClass(activePositionClasses[0]);
								}
							}

							$unitList = $unitList.add($unit);
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

								if(local.initial !== null && local.initial.format('YYYY-MM-DD') === date) {
								} else {
									if(_this.settings.toggle === true) {
										var match = local.storage.activeDates.filter(function(e, i) {
											return e == date;
										});
										local.current[position] = moment(date);
										if(match.length < 1) {
											local.storage.activeDates.push(date);
											$this.addClass(toggleActiveClass).removeClass(toggleInactiveClass);
										} else {
											var index = 0;
											for(var idx in local.storage.activeDates) {
												var targetDate = local.storage.activeDates[idx];
												if(date == targetDate) {
													index = idx;
													break;
												}
											}
											local.storage.activeDates.splice(index, 1);
											$this.removeClass(toggleActiveClass).addClass(toggleInactiveClass);
										}
									} else {
										if(_this.settings.multiple === true) {
											local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
										}

										if($this.hasClass(activeClass)) {
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

											if(_this.settings.multiple === true &&
											   local.current[0] !== null &&
											   local.current[1] !== null) {
												if(local.current[0].diff(local.current[1]) > 0) {
													var tmp = local.current[0];
													local.current[0] = local.current[1];
													local.current[1] = tmp;
													tmp = null;

													local.calendar.find('.' + activeClass).each(function() {
														for(var idx in activePositionClasses) {
															var className = activePositionClasses[idx];
															$(this).toggleClass(className);
														}
													});
												}

												if(local.input === true && _this.settings.buttons === false) {
													$super.val(
														(local.current[0] === null? null:local.current[0].format(_this.settings.format)) + ', ' +
														(local.current[1] === null? null:local.current[1].format(_this.settings.format))
													);
													$parent.trigger('apply.' + ComponentClass); 
												}

												generateDateRange.call();
											}
										}
									}
								}
								local.initial = null;

								if(typeof _this.settings.select === 'function') {
									_this.settings.select.call($this, local.current, local);
								}
							});
						}

						var lastDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.lastDay);
						var lastWeekday = lastDate.weekday();

						for(var i=lastWeekday+1;$unitList.length <= 7 * 5;i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), languagePack.weeks.en[i % 7].toLowerCase()));
							$unitList = $unitList.add($unit);
						}

						var $row = null;
						$unitList.each(function(i, e) {
							if(i % 7 == 0 || i + 1 >= $unitList.length) {
								if($row != null) {
									$row.appendTo($calendarBody);
								}

								if(i + 1 < $unitList.length) {
									$row = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Row')));
								}
							}
							$row.append($(this));
						});

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
					var dateSplit = date.split(',').map(function(e) {
						return $.trim(e);
					});
					this.each(function() {
						var $this = $(this);
						var local = $this[0][ComponentName];
						var context = local.context;

						var dateArray = [
							dateSplit[0] === null? null:moment(dateSplit[0], context.settings.format),
							dateSplit[1] === null? null:moment(dateSplit[1], context.settings.format)
						];

						local.dateManager = new DateManager(dateArray[0]);
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