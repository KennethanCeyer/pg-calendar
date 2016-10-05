/************************************************************************************************************
 *
 * @ Version 1.0.0
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
	this.year = parseInt(d.format('YYYY'));
	this.month = parseInt(d.format('MM'));
	this.prevMonth = parseInt(d.clone().add(-1, 'months').format('MM'));
	this.nextMonth = parseInt(d.clone().add(1, 'months').format('MM'));
	this.day = parseInt(d.format('DD'));
	this.firstDay = 1;
	this.lastDay = parseInt(d.clone().endOf('month').format('DD'));
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
		var code = char.charCodeAt(0);
		if(code >= 65 && code <= 90) {
			className += '-';
			char = String.fromCharCode(Number(code) + 32);
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
 * @ Component define region.
 *
 ***********************************************************************************************************/

var ComponentClass = Helper.GetClass(ComponentName);
(function($) {
	var _calenderTopClass = Helper.GetSubClass('Top');
	var _calenderHeaderClass = Helper.GetSubClass('Header');
	var _calenderBodyClass = Helper.GetSubClass('Body');

	$.fn[ComponentName] = function(options) {
		var Component = {
			init : function(options) {
				var _this = this;
				var languagePack = {
					weeks: {
						en: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
						ko: ['일', '월', '화', '수', '목', '금', '토'],
						ch: ['日', '月', '火', '水', '木', '金', '土'],
					},
					monthsLong: {
						en: ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'],
						ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
						ch: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					},
					months: {
						en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
						ch: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					}
				};

				this.settings = $.extend({
					lang: 'en',
					date: moment(),
					format: 'YYYY-MM-DD',
					weeks: languagePack.weeks.en,
					monthsLong: languagePack.monthsLong.en,
					months: languagePack.months.en
				}, options);

				if(this.settings.lang !== 'en') {
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
					var $unit = $(Helper.Format('<div class="{0} {0}-{2}">{1}</div>', Helper.GetSubClass('Week'), week, languagePack.weeks.en[idx].toLowerCase()));
					$unit.appendTo(_this.global.calender.find('.' + _calenderHeaderClass));
				}

				return this.each(function() {
					var $this = $(this);
					var dateManager = new DateManager(_this.settings.date);
					var local = {
						current: dateManager.date
					};

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

						for(var i=0; i<firstWeekday; i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), languagePack.weeks.en[i].toLowerCase()));
							$unitList = $unitList.add($unit);
						}

						for(var i=dateManager.firstDay; i<=dateManager.lastDay; i++) {
							var iDate = DateManager.Convert(dateManager.year, dateManager.month, i);
							var $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</span></div>', Helper.GetSubClass('Unit'), iDate.format('YYYY-MM-DD'), i, languagePack.weeks.en[iDate.weekday()].toLowerCase()));
							if(iDate.format('YYYY-MM-DD') === local.current.format('YYYY-MM-DD')) {
								$unit.addClass(Helper.GetSubClass('UnitActive'));
							}
							$unitList = $unitList.add($unit);
							$unit.bind('click', function(evnet) {
								event.preventDefault();
								event.stopPropagation();
								var $this = $(this);
								var activeClass = Helper.GetSubClass('UnitActive');
								if($this.hasClass(activeClass)) {
									$this.removeClass(activeClass);
									local.current = null;
								} else {
									_this.global.calender.find('.' + activeClass).removeClass(activeClass);
									$this.addClass(activeClass);
									local.current = moment($this.data('date'));
								}

								if(typeof _this.settings.select === 'function') {
									_this.settings.select.call($this, local.current, _this.global);
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