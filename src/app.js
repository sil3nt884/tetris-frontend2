const express = require('express');
const app = express();
const PORT = 8001;
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

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
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, '/var/www/html/admim')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static', express.static('static'));
app.set('view engine', 'ejs');

const index = require('./routes/index');
app.use('/', index);


app.listen(PORT);
