const fs = require('fs');
const jsyaml = require('js-yaml');
const _get = require('lodash.get');

const config = jsyaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
console.log('config loaded as', config);

const get = (...args) => {
  const value = _get(config, ...args);
  return typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;
};

module.exports = get;
