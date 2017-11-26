'use strict';

const main = require('main');
const models = require('component/models');
const $ = require('jquery');

const root = window ? window : (this || {});

root.moment = require('moment');

$.fn[models.name] = function (options) {
  return main.apply(main, [this, options].concat(Array.prototype.splice.call(arguments, 1)));
};

for (const key in models) {
  $.fn[models.name][key] = models[key];
}