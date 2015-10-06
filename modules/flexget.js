var yaml = require('js-yaml');
var $q = require('q');
var fs = require('fs');
var config = require('./../configs/settings');
var moment = require('moment');
var Show = require('./model').Show();
var log = require('./log');
var underscore = require('underscore');


var flexget = module.exports = {};

flexget.getConfig = function () {
	var d = $q.defer();

	// Get document, or throw exception on error
	try {
		var doc = yaml.load(fs.readFileSync(config.FLEXGET_CONFIG.FULL, 'utf8'));
		d.resolve(doc);
	} catch (e) {
		d.reject(e);
	}

	return d.promise;
};

flexget.makeBackup = function (obj) {
	var d = $q.defer();

	var filename = config.FLEXGET_CONFIG.PATH + '/backup/' + config.FLEXGET_CONFIG.FILE.replace('.yml', '') + '_' + moment().format('x') + '.yml';

	var doc = yaml.dump(obj);

	fs.writeFile(filename, doc, function (err) {
		if (err) {
			log.warn('Flexget', 'Did not write backup, make sure there is backup folder in config.yml location');
			d.reject(err);
		} else {
			log.debug('Flexget', 'Success writing backup' + filename);
			d.resolve();
		}
	});
	return d.promise;
};

flexget.setConfig = function (obj) {
	var d = $q.defer();

	var doc = yaml.dump(obj);

	fs.writeFile(config.FLEXGET_CONFIG.FULL, doc, function(err) {
		if (err) {
			d.reject(err);
		} else {
			d.resolve();
		}
	});


	return d.promise;
};

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
