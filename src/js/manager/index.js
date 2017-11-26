define([
  '../component/helper',
  'moment'
], (helper,
    moment) => {
  const m_dateCache = {};
  const DateManager = function Constructor(date) {
    if (!date) {
      throw new Error('first parameter `date` must be gave');
    }

    if (date instanceof moment === false) {
      if (typeof date === 'string' || typeof date === 'number') {
        date = moment(date);
      }
      else {
        throw new Error('`date` option is invalid type. (date: ' + date + ').');
      }
    }

    this.year = parseInt(date.format('YYYY'), 10);
    this.month = parseInt(date.format('MM'), 10);
    this.prevMonth = parseInt(date.clone().add(-1, 'months').format('MM'), 10);
    this.nextMonth = parseInt(date.clone().add(1, 'months').format('MM'), 10);
    this.day = parseInt(date.format('DD'), 10);
    this.firstDay = 1;
    this.lastDay = parseInt(date.clone().endOf('month').format('DD'), 10);
    this.weekDay = date.weekday();
    this.date = date;
  };

  DateManager.prototype.toString = function () {
    return this.date.format('YYYY-MM-DD');
  };

  DateManager.Convert = function (year, month, day) {
    const date = helper.format('{0}-{1}-{2}', year, month, day);
    if (!m_dateCache[date]) {
      m_dateCache[date] = moment(date, 'YYYY-MM-DD');
    }
    return m_dateCache[date];
  };

  return DateManager;
});