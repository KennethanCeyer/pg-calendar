'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  baseUrl: path.join(path.dirname(fs.realpathSync(__filename)), '..'),
  nodeRequire: require,
  paths: {
    plugin: 'plugins/jquery',
    almond: '../../node_modules/almond/almond',
    jquery: 'shim/jquery',
    moment: 'shim/moment'
  },
};