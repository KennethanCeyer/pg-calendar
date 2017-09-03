'use strict';

const requirejs = require('requirejs');
const requirejsConfig = require('../tests/requirejs.config')
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

requirejs.config(Object.assign(requirejsConfig, {
}));

describe('test for component/helper', function() {
    let Helper;
    before(done => {
        requirejs(['component/helper'], _Helper => {
            Helper = _Helper;
            done();
        });
    });
    
    describe('test `Helper.Format()`', () => {
        it('test cache', () => {
            for (let i=0; i<2; i++) {
                expect(Helper.Format('{0}{1}', 'cache', 'Test'))
                    .to.be.equal('cacheTest');
            }
        });

        it('must be an empty string', () => {
            expect(Helper.Format())
                .to.be.empty;
        });

        it('`{0} {1}` must be `Hello World`', () => {
            expect(Helper.Format('{0} {1}', 'Hello', 'World'))
                .to.be.equal('Hello World');
        });
        
        it('`{0} favorate database engine is {0}{1}`' +
            'must be `My favorate database engine is MySQL`', () => {
            expect(Helper.Format('{0} favorate database engine is {0}{1}', 'My', 'SQL'))
                .to.be.equal('My favorate database engine is MySQL');
        });
        
        it('`check \\{0\\}` must be `check {0}`', () => {
            expect(Helper.Format('check \\{0\\}', 'foo'))
                .to.be.equal('check {0}');
        });
    });
    
    describe('test `Helper.GetClass()`', () => {
        it('test cache', () => {
            for (let i=0; i<2; i++) {
                expect(Helper.GetClass('cacheTest'))
                    .to.be.equal('cache-test');
            }
        });

        it('`Helper.GetClass(\'helloWorld\')`' +
            'must be `hello-world', () => {
            expect(Helper.GetClass('helloWorld'))
                .to.be.equal('hello-world');
        });

        it('`Helper.GetClass(\'1234AB56789b\')`' +
            'must be `1234-a-b56789b', () => {
            expect(Helper.GetClass('1234AB56789b'))
                .to.be.equal('1234-a-b56789b');
        });
    });
    
    describe('test `Helper.GetSubClass()`', () => {
        it('test cache', () => {
            for (let i=0; i<2; i++) {
                expect(Helper.GetSubClass('cacheTest'))
                    .to.be.equal('pignose-calendar-cache-test');
            }
        });

        it('`Helper.GetSubClass(\'helloWorld\')`' +
            'must be `pignose-calendar-hello-world', () => {
            expect(Helper.GetSubClass('helloWorld'))
                .to.be.equal('pignose-calendar-hello-world');
        });

        it('`Helper.GetSubClass(\'1234AB56789b\')`' +
            'must be `pignose-calendar1234-a-b56789b', () => {
            expect(Helper.GetSubClass('1234AB56789b'))
                .to.be.equal('pignose-calendar1234-a-b56789b');
        });
    });
});