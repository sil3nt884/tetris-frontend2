const fs = require('fs');
const jsyaml = require('js-yaml');

const config = jsyaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
console.log('config loaded as', config);
module.exports = config;
