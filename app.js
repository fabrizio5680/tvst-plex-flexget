var tvShowtime = require('./modules/tv_showtime');
var flexget = require('./modules/flexget');
var plex = require('./modules/plex');
var rss = require('./modules/rss');
var model = require('./modules/model');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var $q = require('q');
var fs = require('fs');
var config = require('./configs/settings');
var log = require('./modules/log');


var app = module.exports = {};

app.start = function () {

	if (config.isWindow()) {
		app.startCheckInProcess();
	}

	var startFlexgetProcess = new CronJob({
		cronTime: '*/15 * * * *',
		onTick: function() {
			app.startFlexgetProcess();
			log.log('app', 'Cron Job started', 'TV Showtime Library request */15');
		}
	});

	var updateConfig = new CronJob({
		cronTime: '*/20 * * * *',
		onTick: function() {
			app.updateConfig();

			log.log('app', 'Cron Job started', 'Update Flexget Config with listings */20');
		}
	});

	updateConfig.start();
	startFlexgetProcess.start();
};

app.updateConfig = function () {
	model.Show.find().then(function (shows) {
		flexget.getConfig().then(function (config) {

			if (config.templates &&
				config.templates.filters &&
				config.tasks.tvshows.series &&
				config.tasks.tvshows.series.main) {

				// for diff check
				var preCopy = JSON.stringify(config);

				// make backup
				var copy = JSON.parse(JSON.stringify(config));

				// reset main series
				config.tasks.tvshows.series.main = [];

				for (var i = 0; i < shows.length; i++) {
					var dbShow = shows[i]['_doc'];
					if (dbShow.approved) {
						var item = {};
						item[dbShow.title] = {};
						item[dbShow.title].begin = dbShow.begin;

						if (dbShow.timeframe) {
							item[dbShow.title].timeframe = dbShow.timeframe + ' hours';
						}
						if (dbShow.quality) {
							item[dbShow.title].quality = dbShow.quality;
						}
						if (dbShow.target) {
							item[dbShow.title].target = dbShow.target;
						}
						item[dbShow.title].set = {};
						item[dbShow.title].set.tvdb_id = dbShow.id;
						config.tasks.tvshows.series.main.push(item);
					}
				}

				var postCopy = JSON.stringify(config);

				if (preCopy === postCopy) {
					log.log('app', 'No changes to config');
					return;
				}

				// make backup before saving config
				flexget.makeBackup(copy).then(function () {
					flexget.setConfig(config).then(function () {
						log.log('app', 'Success config written');
					}, function (err) {
						log.warn('app', 'Error writing config' + err);
					});
				}, function () {

				});
			}
		});
	});
};

app.foreverLog = function (numberOfLines) {
	var d = $q.defer();
	var linesToReturn = [];

	numberOfLines = numberOfLines || 50;

	fs.readFile(config.FOREVER_LOG, 'utf8', function (err, data) {
		if (err instanceof Error) {
			d.reject(err);
		} else {
			var lines = data.trim().split('\n');
			var lastLine = lines.slice(-Math.abs( numberOfLines ));
			for (var i = 0; i < lastLine.length; i++) {
				var l = lastLine[i];
				var reg = /\[([\w])]/;
				var line = l.match(reg) && l.match(reg).length ? l.match(reg)[1] : null;
				linesToReturn.push({
					type: line ? line.toLowerCase() : 'pre',
					line: l
				});
			}
			d.resolve(linesToReturn);
		}
	});

	return d.promise;
};

app.flexgetLog = function (numberOfLines) {
	var d = $q.defer();
	var linesToReturn = [];

	numberOfLines = numberOfLines || 50;

	fs.readFile(config.FLEXGET_LOG, 'utf8', function (err, data) {
		if (err instanceof Error) {
			d.reject(err);
		} else {
			var lines = data.trim().split('\n');
			var lastLine = lines.slice(-Math.abs( numberOfLines ));
			for (var i = 0; i < lastLine.length; i++) {
				var l = lastLine[i];
				var reg = /\[([\w])]/;
				var line = l.match(reg) && l.match(reg).length ? l.match(reg)[1] : null;
				linesToReturn.push({
					type: line ? line.toLowerCase() : 'pre',
					line: l
				});
			}
			d.resolve(linesToReturn);
		}
	});

	return d.promise;
};

app.getCheckedInShows = function () {
	return tvShowtime.getCheckedInShows();
};

app.getAddedShows = function () {
	return tvShowtime.getAddedShows();
};


/**
 * Start RSS Process
 */
app.startRssProcess = function () {
	rss.start().then(function () {

	});
};

/**
 * Start CheckIn Process
 */
app.startCheckInProcess = function () {
	log.log('app', 'startCheckInProcess', "Starting Service..");
	tvShowtime.start().then(function () {
		try {
			plex.tailPlexMediaLog(config.PLEX_LOG_FILE, tvShowtime.parseLine);
			log.log('app', 'startCheckInProcess', "Up and running waiting for Plex log..");
		} catch (err) {
			log.warn('app', 'startCheckInProcess', err);
		}
	}, function (err) {
		// TODO handle aut
		log.warn('app', 'startCheckInProcess', err);
		//open('http://localhost:8080');
	});
};


var scheduledShows = function (shows) {
	var delay = function (show) {

		model.rawToDatabase(show);
	};

	for (var i = 0; i < shows.length; i++) {
		delay(shows[i]);
	}
};

app.getShows = function (force) {
	var d = $q.defer();

	// overwrite db with config
	if (force) {
		flexget.getConfig().then(function (config) {
			try {
				var shows = config.tasks.tvshows.series.main;
				scheduledShows(shows);
				d.resolve(shows);
			} catch (e) {
				d.reject(e);
				log.warn('flexget', 'fileRead - getShows', e);
			}
		});
	} else {
		model.Show.find(function (err, shows) {
			if (err)  {
				d.reject(err);
			} else {
				d.resolve(shows);
			}
		});
	}

	return d.promise;
};

app.getCheckIn= function () {
	var d = $q.defer();

	model.CheckIn.find(function (err, shows) {
		if (err)  {
			d.reject(err);
		} else {
			d.resolve(shows);
		}
	});

	return d.promise;
};

/**
 * Start Flexget Service
 */
app.startFlexgetProcess = function () {
	var d = $q.defer();
	tvShowtime.getLibrary().then(function (result) {
		if (result && result.shows) {

			try {
				tvShowtime.addNewShowsToConfig(result.shows);
				d.resolve();
			} catch (e) {
				log.log('app', 'getConfig', 'error working with config file');
				d.reject(e);
			}

		} else {
			log.warn('app', 'No Shows present?');
			d.reject();
		}
	}, function (response) {
		log.warn('app', 'Get Library error' + response);
		d.reject(response);
	});

	return d.promise;
};



