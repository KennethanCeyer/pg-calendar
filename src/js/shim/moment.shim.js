define([
  './shim/utils'
], (utils) => {
  let lib;
  try {
    lib = moment;
  }
  catch (e) {
    ;
  }
  return utils.register('moment', 'npm install moment --save', lib);
});