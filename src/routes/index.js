const evn = global.environment;
const getConfig = require('./../config');

const menu = (req, res) => {
  if (evn === 'prod') {
    res.render('index', { port: getConfig('app.backendPort'), env: 'bundle.js' });
  }
  if (evn === 'dev') {
    res.render('index', { port: getConfig('app.backendPort'), env: 'index.js' });
  }
};

module.exports = menu;
