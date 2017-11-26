'use strict';

const requirejs = require('requirejs');
const requirejsConfig = require('../tests/requirejs.config')
const chai = require('chai');
const expect = chai.expect;

requirejs.config(Object.assign(requirejsConfig, {}));

describe('test for component/classNames', function () {
  let classNames;
  before(done => {
    requirejs(['component/classNames'], _classNames => {
      classNames = _classNames;
      done();
    });
  });

  describe('value validation', () => {
    it('top must be `pignose-calendar-top`', () => {
      expect(classNames.top)
        .to.equal('pignose-calendar-top');
    });

    it('header must be `pignose-calendar-header`', () => {
      expect(classNames.header)
        .to.equal('pignose-calendar-header');
    });

    it('body must be `pignose-calendar-body`', () => {
      expect(classNames.body)
        .to.equal('pignose-calendar-body');
    });

    it('button must be `pignose-calendar-button`', () => {
      expect(classNames.button)
        .to.equal('pignose-calendar-button');
    });
  });
});