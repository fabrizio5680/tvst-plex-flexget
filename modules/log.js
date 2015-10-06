var moment = require('moment');
var log = module.exports = {};


var formatString = function (module, method, message, code) {
	var log = '[' + moment().format('DD-MM-YYYY HH:mm:ss') + '][' + module.toUpperCase() + ']';

	if (code) {
		log += '[CODE: ' + code + ']';
	}

	if (message) {
		log += '[' + method + '] ' + message;
	} else {
		log += ' ' + method;
	}

	return log;
};


log.warn = function (module, method, message, code) {
	var log = '[W]';
	log += formatString(module, method, message, code);
	console.log(log);
};

log.log = function (module, method, message, code) {
	var log = '[L]';
	log += formatString(module, method, message, code);
	console.log(log);
};

log.debug = function (module, method, message, code) {
	var log = '[D]';
	log += formatString(module, method, message, code);
	console.log(log);
};

log.info = function (module, method, message, code) {
	var log = '[I]';
	log += formatString(module, method, message, code);
	console.log(log);
};

log.error = function (module, method, message, code) {
	var log = '[E]';
	log += formatString(module, method, message, code);
	console.log(log);
};

