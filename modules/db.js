
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert');
var $q = require('q');


var url = 'mongodb://localhost:27017/tvshowtime';

mongoose.connect(url);

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

var mango = module.exports = {};
// Use connect method to connect to the Server
mango.connect = function () {
	var d = $q.defer();
	MongoClient.connect(url, function(err, db) {

		assert.equal(null, err);
		if (!err) {
			d.resolve(db);
		} else {
			d.reject(err)
		}
	});
	return d.promise;
};

