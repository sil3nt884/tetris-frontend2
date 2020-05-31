const express = require('express');
const app = express();
const config = require('./config');
const PORT = config.app.frontendPort;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mode = process.env.mode || 'dev';

global.environment = mode;

app.use(logger((tokens, req, res)=>{
  return JSON.stringify( {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    qs: req.query,
    ip: req.connection.remoteAddress,
    headers: req.headers,
    status: tokens.status(req, res),
  }, null, 1);
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (mode === 'dev') {
  app.use('/static', express.static('static'));
}
if (mode === 'prod') {
  app.use('/static', express.static('dist'));
}
app.set('view engine', 'ejs');


const index = require('./routes/index');
app.use('/', index);


app.listen(PORT);
