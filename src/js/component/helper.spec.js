'use strict';

const requirejs = require('requirejs');
const requirejsConfig = require('../tests/requirejs.config')
const chai = require('chai');
const expect = chai.expect;

requirejs.config(Object.assign(requirejsConfig, {}));

describe('test for component/helper', function () {
  let helper;
  before(done => {
    requirejs(['component/helper'], _helper => {
      helper = _helper;
      done();
    });
  });

  describe('test `helper.format()`', () => {
    it('test cache', () => {
      for (let i = 0; i < 2; i++) {
        expect(helper.format('{0}{1}', 'cache', 'Test'))
          .to.be.equal('cacheTest');
      }
    });

    it('must be an empty string', () => {
      expect(helper.format())
        .to.be.empty;
    });

    it('`{0} {1}` must be `Hello World`', () => {
      expect(helper.format('{0} {1}', 'Hello', 'World'))
        .to.be.equal('Hello World');
    });

    it('`{0} favorate database engine is {0}{1}`' +
      'must be `My favorate database engine is MySQL`', () => {
      expect(helper.format('{0} favorate database engine is {0}{1}', 'My', 'SQL'))
        .to.be.equal('My favorate database engine is MySQL');
    });

    it('`check \\{0\\}` must be `check {0}`', () => {
      expect(helper.format('check \\{0\\}', 'foo'))
        .to.be.equal('check {0}');
    });
  });

  describe('test `helper.getClass()`', () => {
    it('test cache', () => {
      for (let i = 0; i < 2; i++) {
        expect(helper.getClass('cacheTest'))
          .to.be.equal('cache-test');
      }
    });

    it('`helper.getClass(\'helloWorld\')`' +
      'must be `hello-world', () => {
      expect(helper.getClass('helloWorld'))
        .to.be.equal('hello-world');
    });

    it('`helper.getClass(\'1234AB56789b\')`' +
      'must be `1234-a-b56789b', () => {
      expect(helper.getClass('1234AB56789b'))
        .to.be.equal('1234-a-b56789b');
    });
  });

  describe('test `helper.getSubClass()`', () => {
    it('test cache', () => {
      for (let i = 0; i < 2; i++) {
        expect(helper.getSubClass('cacheTest'))
          .to.be.equal('pignose-calendar-cache-test');
      }
    });

    it('`helper.getSubClass(\'helloWorld\')`' +
      'must be `pignose-calendar-hello-world', () => {
      expect(helper.getSubClass('helloWorld'))
        .to.be.equal('pignose-calendar-hello-world');
    });

    it('`helper.getSubClass(\'1234AB56789b\')`' +
      'must be `pignose-calendar1234-a-b56789b', () => {
      expect(helper.getSubClass('1234AB56789b'))
        .to.be.equal('pignose-calendar1234-a-b56789b');
    });
  });
});