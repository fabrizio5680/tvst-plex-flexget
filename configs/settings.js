/**
 * Created by fabrizio on 10/08/15.
 */
var config = {};
var isWindows = null;

var local = function () {
	config.THETVDB_KEY = 'E1EE483BF13C51FB'; //plex-tvshowtime-checkin
	config.PLEX_LOG_FILE = 'Plex Media Server.log';
	config.PLEX_SERVER = 'http://127.0.0.1:34700';
	config.FOREVER_LOG = './out.log';
	config.FLEXGET_LOG = './flexget.log';
	//C:\Users\Fabrizio\flexget
	config.FLEXGET_CONFIG = {
		FULL: './config.yml',
		PATH: './',
		FILE: 'config.yml'
	};
};


var windows = function () {
	config.THETVDB_KEY = 'E1EE483BF13C51FB'; //plex-tvshowtime-checkin
	config.PLEX_LOG_FILE = 'C:\\Users\\Fabrizio\\AppData\\Local\\Plex Media Server\\Logs\\Plex Media Server.log';
	config.PLEX_SERVER = 'http://localhost:32400';
	config.FOREVER_LOG = './out.log';
	config.FLEXGET_LOG = 'C:\\Users\\Fabrizio\\flexget\\flexget.log';
	config.FLEXGET_CONFIG = {
		FULL: 'C:\\Users\\Fabrizio\\flexget\\config.yml',
		PATH: 'C:\\Users\\Fabrizio\\flexget\\',
		FILE: 'series.yml'
	};
};

config.isWindow = function () {
	return isWindows;
};

config.set = function (env) {
	env = env || 'local';

	if (env.toUpperCase() === 'windows'.toUpperCase()) {
		windows();
		isWindows = true;
	} else {
		local();
		isWindows = false;
	}
};

module.exports = config;