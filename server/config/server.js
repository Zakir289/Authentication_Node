'use strict';
var acl = require("acl");


var express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	store = require('connect-redis')(session),
	helmet = require('helmet'),
	config = require('./config'),
	favicon = require('serve-favicon'),
	mongoose = require('mongoose'),
	cors = require('cors');

module.exports = function() {
	var app = express();
	app.use(cors());
	app.set('showStackError', true);

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json())

	// CookieParser should be above session
	app.use(cookieParser());

	if (process.env.NODE_ENV !== 'development') {
		app.use(session({
			store: new store({
				host: config.redisServer,
				port: config.redisPort,
				prefix: 'ez_c:'
			}),
			name: 'ez_c',
			secret: 'config.sessionSecret',
			resave: true,
			saveUninitialized: true
		}));
	} else {
		app.use(session({
			name: 'ez_c',
			secret: 'config.sessionSecret',
			resave: true,
			saveUninitialized: true
		}));
	}

	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	require(path.resolve('./server/routes.js'))(app);

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();
		console.error(err.stack);
		res.status(500).send({status: false, err: 'Something broke!'});
	});

	app.use(express.static(path.join(__dirname, '../../public')));
	// Assume 404 since no middleware responded
	// Set view path
	app.set('views', path.join(__dirname, '../views'));
	// set up ejs for templating. You can use whatever
	app.set('view engine', 'ejs');

	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.db);

	mongoose.Promise = global.Promise;

	return app;
};


