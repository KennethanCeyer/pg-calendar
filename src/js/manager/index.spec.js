'use strict';

const requirejs = require('requirejs');
const requirejsConfig = require('../tests/requirejs.config')
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');
requirejs.config(Object.assign(requirejsConfig, {}));

describe('test for manager/index', function () {
  let DateManager;
  before(done => {
    requirejs(['manager/index'], _DateManager => {
      DateManager = _DateManager;
      done();
    });
  });

  describe('test initializing without parameter', () => {
    it('it will be occured an error', () => {
      expect(() => new DateManager())
        .to.throw('first parameter `date` must be gave');
    });
  });

  describe('test initializing with invalid parameter', () => {
    it('it will be occured an error', () => {
      expect(() => new DateManager(true))
        .to.throw('`date` option is invalid type. (date: true).');
    });
  });

  describe('test initializing with moment date', () => {
    it('the year of `moment(\'2017-01-02\')` must be `2017`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.year).to.equal(2017);
    });

    it('the month of `moment(\'2017-01-02\')` must be `1`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.month).to.equal(1);
    });

    it('the day of `moment(\'2017-01-02\')` must be `2`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.day).to.equal(2);
    });

    it('the first day of `moment(\'2017-01-02\')` must be `1`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.firstDay).to.equal(1);
    });

    it('the last day of `moment(\'2017-01-02\')` must be `31`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.lastDay).to.equal(31);
    });

    it('the week day of `moment(\'2017-01-02\')` must be `1`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.weekDay).to.equal(1);
    });

    it('the prev month of `moment(\'2017-01-02\')` must be `12`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.prevMonth).to.equal(12);
    });

    it('the next month of `moment(\'2017-01-02\')` must be `2`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.nextMonth).to.equal(2);
    });

    it('the date of `moment(\'2017-01-02\')` must be an instance of `moment`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.date).to.be.an.instanceof(moment);
    });

    it('the date of `moment(\'2017-01-02\')` is same of `moment(\'2017-01-02\')`', () => {
      const date = moment('2017-01-02');
      const dateManager = new DateManager(date);
      expect(dateManager.date.isSame(moment('2017-01-02'))).to.be.true;
    });

    it('`.toString()` to `moment(\'2017-04-06\')` must be `2017-04-06`', () => {
      const date = moment('2017-04-06');
      const dateManager = new DateManager(date);
      expect(dateManager.toString()).to.equal('2017-04-06');
    });
  });

  describe('test initializing with string-like date', () => {
    it('the year of `2017-01-02` must be `2017`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.year).to.equal(2017);
    });

    it('the month of `2017-01-02` must be `1`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.month).to.equal(1);
    });

    it('the day of `2017-01-02` must be `2`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.day).to.equal(2);
    });

    it('the first day of `2017-01-02` must be `1`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.firstDay).to.equal(1);
    });

    it('the last day of `2017-01-02` must be `31`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.lastDay).to.equal(31);
    });

    it('the week day of `2017-01-02` must be `1`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.weekDay).to.equal(1);
    });

    it('the prev month of `2017-01-02` must be `12`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.prevMonth).to.equal(12);
    });

    it('the next month of `2017-01-02` must be `2`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.nextMonth).to.equal(2);
    });

    it('the date of `2017-01-02` must be an instance of `moment`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.date).to.be.an.instanceof(moment);
    });

    it('the date of `2017-01-02` is same of `moment(\'2017-01-02\')`', () => {
      const date = '2017-01-02';
      const dateManager = new DateManager(date);
      expect(dateManager.date.isSame(moment('2017-01-02'))).to.be.true;
    });

    it('`.toString()` to `2017-04-06` must be `2017-04-06`', () => {
      const date = '2017-04-06';
      const dateManager = new DateManager(date);
      expect(dateManager.toString()).to.equal('2017-04-06');
    });
  });

  describe('test initializing with number-like date', () => {
    it('the year of `1483315200000` must be `2017`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.year).to.equal(2017);
    });

    it('the month of `1483315200000` must be `1`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.month).to.equal(1);
    });

    it('the day of `1483315200000` must be `2`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.day).to.equal(2);
    });

    it('the first day of `1483315200000` must be `1`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.firstDay).to.equal(1);
    });

    it('the last day of `1483315200000` must be `31`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.lastDay).to.equal(31);
    });

    it('the week day of `1483315200000` must be `1`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.weekDay).to.equal(1);
    });

    it('the prev month of `1483315200000` must be `12`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.prevMonth).to.equal(12);
    });

    it('the next month of `1483315200000` must be `2`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.nextMonth).to.equal(2);
    });

    it('the date of `1483315200000` must be an instance of `moment`', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.date).to.be.an.instanceof(moment);
    });

    it('the date of `1483315200000` is same of `moment(\'2017-01-02\')` as UTC', () => {
      const date = 1483315200000;
      const dateManager = new DateManager(date);
      expect(dateManager.date.isSame(moment.utc('2017-01-02'))).to.be.true;
    });

    it('`.toString()` to `1491436800000` must be `2017-04-06`', () => {
      const date = 1491436800000;
      const dateManager = new DateManager(date);
      expect(dateManager.toString()).to.equal('2017-04-06');
    });
  });

  describe('test static methods', () => {
    it('the result of `DateManager.Convert()` must be an instance of `moment`', () => {
      const result = DateManager.Convert(2017, 8, 2);
      expect(result).to.be.an.instanceof(moment);
    });

    it('the result of `DateManager.Convert(2017, 8, 2)` must be same to `2017-08-02`', () => {
      const result = DateManager.Convert(2017, 8, 2);
      expect(result.isSame(moment('2017-08-02'))).to.be.true;
    });
  });
});