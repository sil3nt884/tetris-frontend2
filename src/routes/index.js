const evn = global.environment;
const config = require('../config');

const menu = (req, res) => {
  if (evn === 'prod') {
    res.render('index', { port: config.app.backendPort, env: 'bundle.js' });
  }

  if (evn === 'dev') {
    res.render('index', { port: config.app.backendPort, env: 'index.js' });
  }
};

module.exports = menu;
