/************************************************************************************************************
 *
 * @ Version 1.1.4
 * @ PIGNOSE Calender
 * @ Date Oct 05. 2016
 * @ Author PIGNOSE
 * @ Licensed under MIT.
 *
 ***********************************************************************************************************/

var ComponentName = 'pignoseCalender';

/************************************************************************************************************
 *
 * @ Version 1.0.0
 * @ PIGNOSE PLUGIN HELPER
 * @ Date Oct 05. 2016
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

Helper.Format = function(format) {
	if(typeof format === 'undefined' || format === '' || arguments.length <= 1) {
		return '';
	} else {
		var args = Array.prototype.slice.call(arguments, 1);
		for(var idx in args) {
			var value = args[idx];
			format = format.replace(new RegExp(('((?!\\\\)?\\{' + idx + '(?!\\\\)?\\})'), 'g'), value);
		}
	}
	return format;
};

Helper.GetClass = function(name) {
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
	return className;
};

Helper.GetSubClass = function(name) {
	return Helper.GetClass(Helper.Format('{0}{1}', ComponentName, name));
};

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
(function($) {
	'use strict';
	var _calenderTopClass = Helper.GetSubClass('Top');
	var _calenderHeaderClass = Helper.GetSubClass('Header');
	var _calenderBodyClass = Helper.GetSubClass('Body');

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
					date: moment(),
					format: 'YYYY-MM-DD',
					weeks: languagePack.weeks.en,
					monthsLong: languagePack.monthsLong.en,
					months: languagePack.months.en,
					multiple: false,
					toggle: false
				}, options);

				if(this.settings.lang !== 'en' &&
				   !!$.inArray(this.settings.lang, languagePack.supports) === true) {
					this.settings.weeks = languagePack.weeks[this.settings.lang];
					this.settings.monthsLong = languagePack.monthsLong[this.settings.lang];
					this.settings.months = languagePack.months[this.settings.lang];
				}

				this.global = {
					calender: $(Helper.Format('<div class="{0}">\
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
											  </div>', ComponentClass, _calenderTopClass, _calenderHeaderClass, _calenderBodyClass))
				};

				for(var idx in _this.settings.weeks) {
					var week = _this.settings.weeks[idx];
					if(typeof week !== 'string') {
						continue;
					}
					week = week.toUpperCase();
					var $unit = $(Helper.Format('<div class="{0} {0}-{2}">{1}</div>', Helper.GetSubClass('Week'), week, languagePack.weeks.en[idx].toLowerCase()));
					$unit.appendTo(_this.global.calender.find('.' + _calenderHeaderClass));
				}

				return this.each(function() {
					var $this = $(this);
					var dateManager = new DateManager(_this.settings.date);
					var local = {
						current: [dateManager.date, null],
						storage: {
							activeDates: []
						},
						dateManager: dateManager
					};
					this.local = local;

					var rendering = function() {
						_this.global.calender.appendTo($this.empty());
						_this.global.calender.find('.' + _calenderTopClass + '-year').text(dateManager.year);
						_this.global.calender.find('.' + _calenderTopClass + '-month').text(_this.settings.monthsLong[dateManager.month - 1]);
						_this.global.calender.find(Helper.Format('.{0}-prev .{0}-value', _calenderTopClass)).text(_this.settings.months[dateManager.prevMonth - 1].toUpperCase());
						_this.global.calender.find(Helper.Format('.{0}-next .{0}-value', _calenderTopClass)).text(_this.settings.months[dateManager.nextMonth - 1].toUpperCase());

						var $calenderBody = _this.global.calender.find('.' + _calenderBodyClass).empty();

						var firstDate = DateManager.Convert(dateManager.year, dateManager.month, dateManager.firstDay);
						var firstWeekday = firstDate.weekday();
						var $unitList = $();
						var rangeClass = Helper.GetSubClass('UnitRange');
						var rangeFirstClass = Helper.GetSubClass('UnitRangeFirst');
						var rangeLastClass = Helper.GetSubClass('UnitRangeLast');
						var activeClass = Helper.GetSubClass('UnitActive');
						var activePositionClasses = [Helper.GetSubClass('UnitFirstActive'), Helper.GetSubClass('UnitSecondActive')];
						var toggleClass = Helper.GetSubClass('UnitToggle');

						for(var i=0; i<firstWeekday; i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), languagePack.weeks.en[i].toLowerCase()));
							$unitList = $unitList.add($unit);
						}

						for(var i=dateManager.firstDay; i<=dateManager.lastDay; i++) {
							var iDate = DateManager.Convert(dateManager.year, dateManager.month, i);
							var $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</a></div>', Helper.GetSubClass('Unit'), iDate.format('YYYY-MM-DD'), i, languagePack.weeks.en[iDate.weekday()].toLowerCase()));

							if(_this.settings.toggle === false) {
								if((local.current[0] !== null && iDate.format('YYYY-MM-DD') === local.current[0].format('YYYY-MM-DD'))) {
									$unit.addClass(activeClass).addClass(activePositionClasses[0]);
								}
								
								if((local.current[1] !== null && iDate.format('YYYY-MM-DD') === local.current[1].format('YYYY-MM-DD'))) {
									$unit.addClass(activeClass).addClass(activePositionClasses[1]);
								}
							} else {
								if(!!$.inArray(iDate.format('YYYY-MM-DD'), local.storage.activeDates) === true && local.storage.activeDates.length > 0) {
									$unit.addClass(toggleClass);
								}
							}

							$unitList = $unitList.add($unit);
							$unit.bind('click', function(event) {
								event.preventDefault();
								event.stopPropagation();
								var $this = $(this);
								var position = 0;

								if(_this.settings.toggle === true) {
									var date = $this.data('date');
									var match = local.storage.activeDates.filter(function(e, i) {
										return e == date;
									});
									local.current[position] = moment(date);
									if(match.length < 1) {
										local.storage.activeDates.push(date);
										$this.addClass(toggleClass);
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
										$this.removeClass(toggleClass);
									}
								} else {
									if(_this.settings.multiple === true) {
										_this.global.calender.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
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
												_this.global.calender.find('.' + activeClass + '.' + activePositionClasses[1]).removeClass(activeClass).removeClass(activePositionClasses[1]);
											}
										}

										_this.global.calender.find('.' + activeClass + '.' + activePositionClasses[position]).removeClass(activeClass).removeClass(activePositionClasses[position]);
										$this.addClass(activeClass).addClass(activePositionClasses[position]);
										local.current[position] = moment($this.data('date'));

										if(position == 1) {
											if(local.current[0].diff(local.current[1]) > 0) {
												var tmp = local.current[0];
												local.current[0] = local.current[1];
												local.current[1] = tmp;
												tmp = null;

												_this.global.calender.find('.' + activeClass).each(function() {
													for(var idx in activePositionClasses) {
														var className = activePositionClasses[idx];
														$(this).toggleClass(className);
													}
												});
											}
										}

										if(local.current[0] !== null &&
										   local.current[1] !== null) {
											var firstDay = parseInt(local.current[0].format('DD'), 10);
											var lastDay = parseInt(local.current[1].format('DD'), 10);
											for(var i = firstDay + 1; i<lastDay; i++) {
												var date = DateManager.Convert(dateManager.year, dateManager.month, i).format('YYYY-MM-DD');
												var $target = _this.global.calender.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('Unit'), date)).addClass(rangeClass);

												if(i === firstDay + 1) {
													$target.addClass(rangeFirstClass);
												}
												
												if(i === lastDay - 1) {
													$target.addClass(rangeLastClass);
												}
											}
										}
									}
								}

								if(typeof _this.settings.select === 'function') {
									$.extend(local.storage, _this.global);
									_this.settings.select.call($this, local.current, local.storage);
								}
							});
						}

						var lastDate = DateManager.Convert(dateManager.year, dateManager.month, dateManager.lastDay);
						var lastWeekday = lastDate.weekday();

						for(var i=lastWeekday+1;$unitList.length <= 7 * 5;i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), languagePack.weeks.en[i % 7].toLowerCase()));
							$unitList = $unitList.add($unit);
						}

						var $row = null;
						$unitList.each(function(i, e) {
							if(i % 7 == 0 || i + 1 >= $unitList.length) {
								if($row != null) {
									$row.appendTo($calenderBody);
								}

								if(i + 1 < $unitList.length) {
									$row = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Row')));
								}
							}
							$row.append($(this));
						});

						_this.global.calender.find('.' + _calenderTopClass + '-nav').bind('click', function(event) {
							event.preventDefault();
							event.stopPropagation();
							var $this = $(this);
							if($this.hasClass(_calenderTopClass + '-prev')) {
								dateManager = new DateManager(dateManager.date.add(-1, 'months'));
								rendering();
							}
							else if($this.hasClass(_calenderTopClass + '-next')) {
								dateManager = new DateManager(dateManager.date.add(1, 'months'));
								rendering();
							}
						});
					};
					rendering();
				});
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