'use strict';

const fs = require('fs');
const path = require('path');
const requirejs = require('requirejs');
const requirejsConfig = require('../tests/requirejs.config')
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../..', 'package.json'), 'utf8'));
const version = packageJson.version;

requirejs.config(Object.assign(requirejsConfig, {}));

describe('test for component/models', function () {
  let models;
  before(done => {
    requirejs(['component/models'], _models => {
      models = _models;
      done();
    });
  });

  describe('type validation of models', () => {
    it('name must be pignoseCalendar', () => {
      expect(models.name)
        .to.equal('pignoseCalendar');
    });

    it('`supports` preference must be object type', () => {
      expect(models.preference.supports)
        .to.be.an('object');
    });

    it('the `themes` of `supports` preference must be object type', () => {
      expect(models.preference.supports.themes)
        .to.be.an('array');
    });
  });

  describe('test that declared version of models is latest', () => {
    it('version must be latest', () => {
      expect(models.version)
        .to.equal(version);
    });
  });
});