"use strict";

// Crypto-currency dashboard technical test, Paul Hodgson

var log4js = require('log4js');
var logger = log4js.getLogger("server");
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
logger.level = 'trace';

var config = require('./configuration/config.js');

var api = require('./routes/api');
var app = express();

// Configure express

app.set('port', config.port); // Set port from the configuration file

// Cors configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Map our api
app.use('/api', api);

// Serve our static pages
app.use(express.static(path.join(__dirname, 'www')));

logger.trace("Initialiasing");

var server = app.listen(app.get('port'), () => {
    logger.info('Express server listening on port ' + server.address().port);
});