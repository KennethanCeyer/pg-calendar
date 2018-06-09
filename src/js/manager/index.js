define([
    '../component/helper',
    'moment'
], (helper,
    moment) => {
    const dateCache = {};
    return class DateManager {
        constructor(date) {
            if (!date)
                throw new Error('first parameter `date` must be gave');

            if (!(date instanceof moment)) {
                if (typeof date !== 'string' && typeof date !== 'number')
                    throw new Error(`\`date\` option is invalid type. (date: ${date}).`);

                date = moment(date);
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
        }

        toString() {
            return this.date.format('YYYY-MM-DD');
        }

        static Convert (year, month, day) {
            const date = `${year}-${month}-${day}`;

            if (!dateCache[date])
                dateCache[date] = moment(date, 'YYYY-MM-DD');

            return dateCache[date];
        }
    };
});
