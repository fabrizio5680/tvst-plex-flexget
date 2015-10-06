/*!
 *
 * Start with forever
 *
 * forever start --spinSleepTime 1000ms --minUptime 1000ms -a checkin.js
 * optional -l plex-tvshowtime-checkin.log -o out.log -e err.log
 *
 */

// forever start -l plex-tvshowtime-checkin.log -o out.log -e err.log --spinSleepTime 1000ms --minUptime 1000ms -a checkin.js


var fs = require('fs');
var plex = require('./plex');
var client = require('./client');
var $q = require('q');
var rest = require('restler');
var URI = require('URIjs');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var log = require('./log');
var mongo = require('./db');
var model = require('./model');

var tvShowtime = module.exports = {};
var API_ENDPOINT = URI('https://api.tvshowtime.com/v1');
var CLIENT_ID = 'va0D2CEfSPNNlLoYMYYT';
var CLIENT_SECRET = 'RF51gSEZBJAbLXmEUCZ8thJAwJPAyQSafCQCyqOt';
var USER_AGENT = 'plex-tvst-scrobbler';

var authResult = null;
var metadata = {};
var access_token = null;
var shows = [];
var addedShows = [];

/**
 * Parse Line
 * @param line
 */
tvShowtime.parseLine = function (line) {
	var regex = new RegExp('Updated play state for /library/metadata/([0-9]+)');
	var match = line.match(regex);

	if (!match) {
		return;
	}

	var key = match[1];

	if (metadata[key]) {
		return;
	}

	metadata[key] = {};

	// seek initial view count
	startMetaUpdateProcess(match[1]);
};

/**
 * Get Initial value of viewCount
 * @param metaKey
 */
var startMetaUpdateProcess = function (metaKey) {
	var initialViewCount = 0;
	var newViewCount = 0;
	plex.getXMLDataFromPlex(metaKey).then(function (xml) {
		var info = plex.getShowInfo(xml);

		var diff = moment(info.lastViewedAt, 'X').diff(moment(), 'days');

		if (diff >= 1) {
			log.warn('tvshowtime', 'startMetaUpdateProcess', 'Reject CheckIn (Old): ' + JSON.stringify(plex.getShowInfo(xml)));
			return;
		}

		log.debug('tvshowtime', 'startMetaUpdateProcess', 'Processing: ' + JSON.stringify(plex.getShowInfo(xml)));

		initialViewCount = info.views;
		metadata[metaKey].viewCount = info.views;

		var job = new CronJob({
			cronTime: '*/1 * * * *',
			onTick: function() {
				plex.getXMLDataFromPlex(metaKey).then(function (xml) {
					var info = plex.getShowInfo(xml);
					newViewCount = info.views;

					if (newViewCount !== initialViewCount) {
						uploadTvShowTime(metaKey);
						job.stop();
					}

					var diff = moment(info.lastViewedAt, 'X').diff(moment(), 'days');

					if (diff >= 1) {
						log.warn('tvshowtime', 'cron onTick', 'Reject CheckIn (Old): ' + metaKey);
						job.stop();
					}
				});
			},
			start: true
		});

		job.start();
	});
};



/**
 * Upload to TV ShowTime
 * @param metaKey
 */
var uploadTvShowTime = function (metaKey) {
	plex.getXMLDataFromPlex(metaKey, true).then(function (xml) {
		var payload = plex.getShowInfo(xml);
		scrobble(payload, xml).then(function () {
			delete metadata[metaKey];
		});
	});
};


/**
 * Scrobble
 * @returns {Promise.promise|*}
 */

var count = 0;
var scrobble = function (payload, xml) {
	var d = $q.defer();
	var url = API_ENDPOINT + '/checkin';

	log.log('tvshowtime', 'scrobble', 'Sending info [REQ#' + count + ']: ' + payload.parent);

	var data = {
		'access_token': access_token,
		'show_id': payload.show_id,
		'season_number': parseInt(payload.season_number, 10) > 9 ? payload.season_number : '0' + payload.season_number,
		'number': parseInt(payload.number, 10) > 9 ? payload.number : '0' + payload.number
	};

	rest.post(url, {
		headers: {
			'User-Agent': USER_AGENT
		},
		data: data

	}).on('complete', function(result) {
		if (result && result.result === 'OK') {
			log.info('tvshowtime', 'Checked in  [REQ#' + count + ']', result);
			var checkIn = model.CheckIn(plex.getShowInfo(xml));
			checkIn.save(function (err) {
				if (err) {
					log.warn('tvshowtime', 'db_save', err);
				}
			});
			shows.push('[' + moment().format('DD-MM-YYYY HH:mm:ss') + ']' + 'Show added: ' + JSON.stringify(plex.getShowInfo(xml)));
			count += 1;
			d.resolve();
		} else {
			d.reject(result);
		}
	});

	return d.promise;
};

/**
 * Authorize
 * @returns {Promise.promise|*}
 */
var authorize = function () {
	var d = $q.defer();
	var url = API_ENDPOINT + '/oauth/device/code';
	rest.post(url, {
		headers: {
			'User-Agent': USER_AGENT
		},
		data: {
			'client_id': CLIENT_ID
		}
	}).on('complete', function(result) {
		if (result && result.device_code) {
			var json = JSON.stringify(result);

			fs.writeFile("./auth.json", json, function(err) {
				if(err) {
					return log.error('tvshowtime', 'authorize', err);
				}

				authResult = result;
				d.resolve(result);
			});
		} else {
			console.warn('authorize failed: ', result);
			d.reject(result);
		}
	});

	return d.promise;
};

/**
 * Get Access Token
 * @returns {Promise.promise|*}
 */
var getAccessToken = function () {
	var d = $q.defer();

	var url = API_ENDPOINT + '/oauth/access_token';

	var token = JSON.parse(fs.readFileSync('token.json'));

	if (token && token.access_token) {
		access_token = token.access_token;
		d.resolve(token.access_token);
		return d.promise;
	}

	var auth = JSON.parse(fs.readFileSync('auth.json'));
	if (!auth) {
		d.reject({});
		return d.promise;
	}

	rest.post(url, {
		headers: {
			'User-Agent': USER_AGENT
		},
		data: {
			'client_id': CLIENT_ID,
			'client_secret': CLIENT_SECRET,
			'code': auth.device_code
		}
	}).on('complete', function(result) {
		if (result.result === 'KO') {
			console.warn(result);
			d.reject(result)
		} else {
			fs.writeFile('token.json', JSON.stringify(result), function (err) {});
			console.info(result);
			access_token = result.access_token;
			d.resolve(result);
		}
	});
	return d.promise;
};



tvShowtime.getToken = function () {
	var token = JSON.parse(fs.readFileSync('token.json'));

	if (token && token.access_token) {
		access_token = token.access_token;
		return access_token;
	}
	return null;
};

tvShowtime.getLibrary = function () {
	var d = $q.defer();
	var token = this.getToken();
	var url = API_ENDPOINT + '/library';

	if (!token) {
		d.reject('');
		return d.promise;
	}

	var options = {
		query: {
			page: 0,
			limit: 10000,
			access_token: token
		}
	};

	client.get(url, options).then(function (result) {
		d.resolve(result);
	}, function (result) {
		d.reject(result);
	});

	return d.promise;
};

var error = function () {

};

var setBegin = function (item) {
	var begin = null;

	if (item.last_seen) {
		begin = 'S';
		begin += item.last_seen.season_number < 10 ? '0' + item.last_seen.season_number : item.last_seen.season_number;
		begin += 'E';
		begin += item.last_seen.number < 10 ? '0' + item.last_seen.number : item.last_seen.number;
	} else {
		begin = 'S01E01'
	}
	return begin;
};

tvShowtime.getAddedShows = function () {
	return addedShows;
};


tvShowtime.addNewShowsToConfig = function (fromApi) {

	for (var i = 0; i < fromApi.length; i++) {
		var apiShow = fromApi[i];
		var item = {};
		item[apiShow.name] = {};
		item[apiShow.name].begin = setBegin(apiShow);
		item[apiShow.name].set = {};
		item[apiShow.name].set.tvdb_id = apiShow.id;
		// add to db
		model.rawToDatabase(item);
	}

};



tvShowtime.parseNotSeen = function (shows) {
	var parsed = [];
	for (var i = 0; i < shows.length; i++) {
		var show = shows[i];

		if (!show.last_seen) {
			parsed.push(show);
		}

	}

	return parsed;
};

/**
 * Start service
 */
tvShowtime.start = function () {
	var d = $q.defer();
	getAccessToken().then(function () {
		d.resolve();
	}, function () {
		authorize().then(function (auth) {
			d.reject(auth);
		});

	});
	return d.promise;
};

tvShowtime.getCheckedInShows = function () {
	return shows;
};


