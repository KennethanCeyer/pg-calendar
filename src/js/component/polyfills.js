define([], () => {
    if (!Array.prototype.filter)
        return;

    Array.prototype.filter = function (func) {
        'use strict';

        if (typeof func !== 'function')
            return [];

        if (!this)
            throw new TypeError();

        const thisObject = Object(this);
        const len = thisObject.length >>> 0;
        const filteredResult = [];
        const hofThis = arguments[1];

        for (let i = 0; i < len; i++) {
            if (i in thisObject) {
                const val = thisObject[i];
                if (func.call(hofThis, val, i, thisObject))
                    filteredResult.push(val);
            }
        }
        return filteredResult;
    }
});
