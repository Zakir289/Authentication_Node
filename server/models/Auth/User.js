// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;




module.exports = mongoose.model('user', new Schema({
	accountId: {type:String},
	name: {type: String},
	email:   { type: String, unique: true},
	phoneNo: {type: Number, unique: true},
	passwordSalt: {type: String},
	passwordHash: {type: String}
},{versionKey: false}));
