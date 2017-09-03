'use strict';

const requirejs = require('requirejs');
const requirejsConfig = require('../tests/requirejs.config')
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

requirejs.config(Object.assign(requirejsConfig, {
}));

describe('test for component/classNames', function() {
    let ClassNames;
    before(done => {
        requirejs(['component/classNames'], _ClassNames => {
            ClassNames = _ClassNames;
            done();
        });
    });
    
    describe('value validation', () => {
        it('top must be `pignose-calendar-top`', () => {
            expect(ClassNames.top)
                .to.equal('pignose-calendar-top');
        });

        it('header must be `pignose-calendar-header`', () => {
            expect(ClassNames.header)
                .to.equal('pignose-calendar-header');
        });
        
        it('body must be `pignose-calendar-body`', () => {
            expect(ClassNames.body)
                .to.equal('pignose-calendar-body');
        });
        
        it('button must be `pignose-calendar-button`', () => {
            expect(ClassNames.button)
                .to.equal('pignose-calendar-button');
        });
    });
});