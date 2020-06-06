const evn = global.environment;
const getConfig = require('./../config');

const menu = (req, res) => {
  const config = JSON.stringify(
      {
        backendPort: getConfig('app.backendPort'),
        mulitiPlayerTimeout: getConfig('app.mulitiPlayerTimeout'),
        baseURL: getConfig('app.baseURL'),
      });

  if (evn === 'prod') {
    res.render('index', { config: config, env: 'bundle.js' });
  }
  if (evn === 'dev') {
    res.render('index', { config: config, env: 'index.js' });
  }
};

module.exports = menu;
