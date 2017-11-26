define([], () => {
  if (!Array.prototype.filter) {
    Array.prototype.filter = function (func) {
      'use strict';
      if (this === null) {
        throw new TypeError();
      }

      const t = Object(this);
      const len = t.length >>> 0;

      if (typeof func !== 'function') {
        return [];
      }

      const res = [];
      const thisp = arguments[1];
      for (let i = 0; i < len; i++) {
        if (i in t) {
          const val = t[i];
          if (func.call(thisp, val, i, t)) {
            res.push(val);
          }
        }
      }
      return res;
    };
  }
});