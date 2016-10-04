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
	var _clenderTopClass = Helper.GetSubClass('Top');
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
											  </div>', ComponentClass, _clenderTopClass, _calenderHeaderClass, _calenderBodyClass))
				};

				return this.each(function() {
					var $this = $(this);
					var dateManager = new DateManager(_this.settings.date);

					_this.global.calender.appendTo($this);

					for(var idx in _this.settings.weeks) {
						var week = _this.settings.weeks[idx];
						var $unit = $(Helper.Format('<div class="{0}">{1}</div>', Helper.GetSubClass('Week'), week));
						$unit.appendTo(_this.global.calender.find('.' + _calenderHeaderClass));
					}

					var firstDate = DateManager.Convert(dateManager.year, dateManager.month, dateManager.firstDay);
					var firstWeekday = firstDate.weekday();

					for(var i=0; i<=firstWeekday; i++) {
						var $unit = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Unit')));
						$unit.appendTo(_this.global.calender.find('.' + _calenderBodyClass));
					}

					for(var i=dateManager.firstDay; i<=dateManager.lastDay; i++) {
						var iDate = DateManager.Convert(dateManager.year, dateManager.month, i);
						var $unit = $(Helper.Format('<div class="{0} {0}-date" data-date="{1}">{2}</div>', Helper.GetSubClass('Unit'), iDate.format('YYYY-MM-DD'), i));
						$unit.appendTo(_this.global.calender.find('.' + _calenderBodyClass));
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
						var $unit = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('Unit')));
						$unit.appendTo(_this.global.calender.find('.' + _calenderBodyClass));
					}
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