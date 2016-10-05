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
	this.day = parseInt(d.format('DD'));
	this.firstDay = 1;
	this.lastDay = parseInt(d.endOf('month').format('DD'));
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

				this.settings = $.extend({
					date: moment(),
					format: 'YYYY-MM-DD',
					weeks: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
				}, options);

				this.global = {
					calender: $(Helper.Format('<div class="{0}">\
												<div class="{1}">\
													<a href="#" class="{1}-nav {1}-prev">&lt;</a>\
													<div class="{1}-date"></div>\
													<a href="#" class="{1}-nav {1}-next">&gt;</a>\
												</div>\
												<div class="{2}"></div>\
												<div class="{3}"></div>\
											  </div>', ComponentClass, _calenderTopClass, _calenderHeaderClass, _calenderBodyClass))
				};

				for(var idx in _this.settings.weeks) {
					var week = _this.settings.weeks[idx];
					var $unit = $(Helper.Format('<div class="{0}">{1}</div>', Helper.GetSubClass('Week'), week));
					$unit.appendTo(_this.global.calender.find('.' + _calenderHeaderClass));
				}

				return this.each(function() {
					var $this = $(this);
					var dateManager = new DateManager(_this.settings.date);

					var rendering = function() {
						_this.global.calender.appendTo($this.empty());
						_this.global.calender.find('.' + _calenderTopClass + '-date').text(Helper.Format('{0}/{1}', dateManager.year, dateManager.month));

						var $calenderBody = _this.global.calender.find('.' + _calenderBodyClass).empty();

						var firstDate = DateManager.Convert(dateManager.year, dateManager.month, dateManager.firstDay);
						var firstWeekday = firstDate.weekday();
						var $unitList = $();
						console.log(firstDate, firstWeekday);

						for(var i=0; i<firstWeekday; i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), _this.settings.weeks[i].toLowerCase()));
							$unitList = $unitList.add($unit);
						}

						for(var i=dateManager.firstDay; i<=dateManager.lastDay; i++) {
							var iDate = DateManager.Convert(dateManager.year, dateManager.month, i);
							var $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</span></div>', Helper.GetSubClass('Unit'), iDate.format('YYYY-MM-DD'), i, _this.settings.weeks[iDate.weekday()].toLowerCase()));
							$unitList = $unitList.add($unit);
							$unit.bind('click', function(evnet) {
								event.preventDefault();
								event.stopPropagation();
								var $this = $(this);
								console.log($this.data('date'));
							});
						}

						var lastDate = DateManager.Convert(dateManager.year, dateManager.month, dateManager.lastDay);
						var lastWeekday = lastDate.weekday();

						for(var i=lastWeekday+1;i<=6;i++) {
							var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('Unit'), _this.settings.weeks[i].toLowerCase()));
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