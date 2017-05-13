define([
  'core',
  'component/models'
], function (Component, models) {
  'use strict';

  var PignoseCalendar = function (element, options) {
    if (typeof Component[options] !== 'undefined') {
      return Component[options].apply(element, Array.prototype.slice.call(arguments, 2));
    } else if (typeof options === 'object' || !options) {
      return Component.init.apply(element, Array.prototype.slice.call(arguments, 1));
    } else {
      console.error('Argument error are occured.');
    }
  };

  for (var idx in models) {
    PignoseCalendar[idx] = models[idx];
  }

  return PignoseCalendar;
});