define([], function () {
  var lib = moment;
  var message = 'PIGNOSE Calendar plugin must be needed moment library.\n' +
    'If you want to use built-in plugin, Import `dist/pignose.calendar.full.js`.'

  if (typeof lib === 'undefined' || lib === null) {
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }
  }

  return lib;
});