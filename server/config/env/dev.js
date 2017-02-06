'use strict';

module.exports = {
	port: process.env.PORT || 8080,
	host: process.env.HOST || '0.0.0.0',
	app: {
		title: 'SampleAuth'
	},
	mongo: {
		host: process.env.MONGO_HOST || 'localhost',
		port: process.env.MONGO_PORT || '27017',
		db: process.env.DATABASE || 'auth'
	},
	secretkey: "ZakTesting"	
};
