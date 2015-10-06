var $q = require('q');
var rest = require('restler');
var log = require('./log');

var client = module.exports = {};

/**
 * HTTP GET request
 * @returns {Promise.promise|*}
 */
client.get = function (url, options, noLogs) {
	var d = $q.defer();
	var retries = 0;

	rest.get(url, options).on('complete', function(result) {
		if (result instanceof Error || result.result === 'KO' || result.code === 403) {
			log.error('client', 'get', result.message, result.code);
			if (retries === 5) {
				d.reject({ error: true, message: result.message });
				return;
			}
			retries += 1;
			//this.retry(5000); // try again after 5 sec
		} else {
			if (!noLogs) {
				log.debug('client', 'get', 'Success retrieving ' + url);
			}
			d.resolve(result);
		}
	});


	return d.promise;
};


