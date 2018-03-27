define([
  './methods/index',
  './component/models',
  './component/polyfills',
], (methods,
    models) => {
  'use strict';
  window[models.name] = {
    version: models.version
  };

  const Component = methods;
  return Component;
});
