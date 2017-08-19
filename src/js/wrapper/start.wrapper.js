(function (root, factory) {
    if (typeof define !== 'undefined' && define.amd) {
        // AMD loader type declaration.
        define(['jquery', 'moment'], function(jquery, moment) {
            factory(window, document, jquery, moment);
        });
    }
    else if (typeof module === 'object') {
        var jsdom = require('jsdom').jsdom;
        var _document = jsdom('<html></html>', {});
        var _window = _document.defaultView;
        var _jquery = require('jquery')(_window);
        var _moment = require('moment');
        module.exports = factory(_window, _document, _jquery, _moment);
    }
    else {
        root.pignoseCalendar = factory(window, document, jQuery, moment);
    }
}(this, function (window, document, jquery, moment) {