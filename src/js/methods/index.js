define([
  './init',
  './configure',
  './setting',
  './select',
  './set',
], (methodInit,
    methodConfigure,
    methodSetting,
    methodSelect,
    methodSet) => {
  return {
    init: methodInit,
    configure: methodConfigure,
    setting: methodSetting,
    select: methodSelect,
    set: methodSet
  };
});