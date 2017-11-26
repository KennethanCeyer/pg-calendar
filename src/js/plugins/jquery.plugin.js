'use strict';

const Constructor = require('main');
const models = require('component/models');
const $ = require('jquery');

const root = window? window : (this || {});

root.moment = require('moment');

$.fn[models.ComponentName] = function (options) {
  return Constructor.apply(Constructor, [this, options].concat(Array.prototype.splice.call(arguments, 1)));
};

for (const key in models) {
  $.fn[models.ComponentName][key] = models[key];
}