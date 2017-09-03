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

requirejs.config(Object.assign(requirejsConfig, {
}));

describe('test for component/models', function() {
    let Models;
    before(done => {
        requirejs(['component/models'], _Models => {
            Models = _Models;
            done();
        });
    });
    
    describe('type validation of models', () => {
        it('name must be pignoseCalendar', () => {
            expect(Models.ComponentName)
                .to.equal('pignoseCalendar');
        });

        it('`supports` preference must be object type', () => {
            expect(Models.ComponentPreference.supports)
                .to.be.an('object');
        });
        
        it('the `themes` of `supports` preference must be object type', () => {
            expect(Models.ComponentPreference.supports.themes)
                .to.be.an('array');
        });
    });

    describe('test that declared version of models is latest', () => {
        it('version must be latest', () => {
            expect(Models.ComponentVersion)
                .to.equal(version);
        });
    });
});