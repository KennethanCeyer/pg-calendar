define(['../component/index', 'moment'], function(Helper, moment) {
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

	return DateManager;
});