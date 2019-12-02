const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const env = require('dotenv').config();

// Database
const mongo = require('mongodb');
const monk = require('monk');
const db = monk(process.env.MONGOCONNECTURI);

const routes = require('./routes/index');
const users = require('./routes/users');

const cors = require('cors');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// customized for html as view engine 
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);

/*app.use(cors({
  origin: process.env.CLIENT_HOST | 'http://localhost:3000'
}));*/
app.use(cors());
app.use('/api', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
let environment = process.env.ENVIRONMENT || 'production';
if (environment === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: 'Error',
            body: 'Error!',
            message: err.message,
            error: {}
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;