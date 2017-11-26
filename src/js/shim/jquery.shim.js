define([
  './shim/utils'
], (utils) => {
  let lib;
  try {
    lib = jQuery || $;
  }
  catch (e) {
    ;
  }
  return utils.register('jquery', 'npm install jquery --save', lib);
});