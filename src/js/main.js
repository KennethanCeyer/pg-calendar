define([
    'core',
    'component/models'
], function (Component, Models) {
    'use strict';

    const PignoseCalendar = function (element, options) {
        if (typeof Component[options] !== 'undefined') {
            return Component[options].apply(element, Array.prototype.slice.call(arguments, 2));
        }
        else if (typeof options === 'object' || !options) {
            return Component.init.apply(element, Array.prototype.slice.call(arguments, 1));
        }
        else {
            console.error('Argument error are occured.');
        }
    };

    for (const idx in Models) {
        PignoseCalendar[idx] = Models[idx];
    }

    return PignoseCalendar;
});