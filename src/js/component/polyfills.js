define([], function () {
  if (typeof Array.prototype.filter === 'undefined') {
    Array.prototype.filter = function (func) {
      'use strict';
      if (this == null) {
        throw new TypeError();
      }

      var t = Object(this);
      var len = t.length >>> 0;

      if (typeof func !== 'function') {
        return [];
      }

      var res = [];
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i];
          if (func.call(thisp, val, i, t)) {
            res.push(val);
          }
        }
      }
      return res;
    };
  }
});