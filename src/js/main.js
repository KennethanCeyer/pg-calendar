define([
  'core',
  'component/models'
], function (component, models) {
  'use strict';

  const pignoseCalendar = function (element, options) {
    if (typeof component[options] !== 'undefined') {
      return component[options].apply(element, Array.prototype.slice.call(arguments, 2));
    }
    else if (typeof options === 'object' || !options) {
      return component.init.apply(element, Array.prototype.slice.call(arguments, 1));
    }
    else {
      console.error('Argument error are occured.');
    }
  };

  pignoseCalendar.component = {};
  for (const idx in models) {
    pignoseCalendar.component[idx] = models[idx];
  }

  return pignoseCalendar;
});