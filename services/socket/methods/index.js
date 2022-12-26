/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path');
require('fs')
  .readdirSync(__dirname)
  .forEach((file) => {
    if (file === 'index.js') return;

    const MODULE = require(path.join(__dirname, file));

    module.exports[path.basename(file, '.js')] = MODULE.default || MODULE;
  });
