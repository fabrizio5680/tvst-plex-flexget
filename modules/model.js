var mongoose = require('mongoose');
var TVDB = require("node-tvdb/compat");
var underscore = require('underscore');
var config = require('./../configs/settings');
var $q = require('q');
var tvdb = null;

var model = module.exports = {};


/**
 * Series Show
 * @returns {mongoose.Schema}
 * @constructor
 */
model.Show = (function () {
	var showSchema = new mongoose.Schema({
		approved: { type: Boolean, default: false },
		id: String,
		title: String,
		begin: String,
		FirstAired: String,
		IMDB_ID: String,
		Network: String,
		Overview: String,
		SeriesName: String,
		banner: String,
		language: String,
		seriesid: String,
		zap2it_id: String,
		target: { type: String, default: '1080p hdtv+ h264' },
		quality: { type: String, default: '720p+' },
		timeframe: { type: Number, default: 12 },
		matchingIssue: { type: Boolean, default: false },
		tvdb: {
			isSet: { type: Boolean, default: false },
			id: Number,
			name: { type: String, default: 'tvdb_id' }
		}
	});

	return mongoose.model('Show', showSchema);
}());


model.CheckIn = (function () {
	var checkInSchema = new mongoose.Schema({
		art: String,
		lastViewedAt: String,
		number: String,
		parent: String,
		season_number: String,
		show_id: String,
		views: String
	});

	return mongoose.model('CheckIn', checkInSchema);
}());

model.saveShow = function (show) {
	var d = $q.defer();
	model.Show.findOne({ id: show.id }, function(err, dbShow) {
		if (err) {
			d.reject(err)
		}

		if (dbShow) {

			for (var param in show) {
				if (show.hasOwnProperty(param)) {
					dbShow[param] = show[param];
				}
			}

			dbShow.save(function (err, s) {
				if (err) {
					d.reject(err)
				}

				if (s) {
					d.resolve(s);
				}
			});
		}
	});

	return d.promise;
};

model.deleteShow = function (show) {
	var d = $q.defer();
	model.Show.findOne({ id: show.id }, function(err, dbShow) {
		if (err) {
			d.reject(err)
		}

		if (dbShow) {

			dbShow.remove(function (err, s) {
				if (err) {
					d.reject(err)
				}

				if (s) {
					d.resolve(s);
				}
			});
		}
	});

	return d.promise;
};


model.rawToDatabase = function (showRaw) {

	if (!tvdb) {
		tvdb = new TVDB(config.THETVDB_KEY);
	}

	var tvdbRequest = function (showRaw) {
		var d = $q.defer();
		var matchingShow = null;
		var originalTitle = Object.keys(showRaw);
		var title = originalTitle[0].replace(/[(][\d]+[)]/, '');

		tvdb.getSeriesByName(title).then(function (response) {

			if (response && response.length > 0) {
				for (var i = 0; i < response.length; i++) {
					var resp = response[i];
					if (resp.SeriesName.toLowerCase() === originalTitle[0].toLowerCase()) {
						matchingShow = resp;
					}
				}

				if (!matchingShow) {
					matchingShow = {};
					matchingShow.SeriesName = originalTitle[0];
					matchingShow.matchingIssue = true;
				}

				var merged = underscore.extend(showRaw, matchingShow, showRaw[Object.keys(showRaw)[0]]);

				d.resolve(merged);
			} else {
				console.warn(showRaw);
				d.reject();
			}

		}).catch(function (err) {
			console.warn(err);
			d.reject(err);
		});

		return d.promise;
	};

	var doInsert = function (s) {
		var show = model.Show({
			id: s.id,
			title: s.SeriesName,
			begin: s.begin,
			FirstAired: s.FirstAired,
			IMDB_ID: s.IMDB_ID,
			Network: s.Network,
			Overview: s.Overview,
			SeriesName: s.SeriesName,
			banner: s.banner,
			language: s.language,
			seriesid: s.seriesid,
			zap2it_id: s.zap2it_id,
			matchingIssue: s.matchingIssue,
			tvdb: {
				isSet: s.id && s.SeriesName ? true : false,
				id: s.id,
				name: 'tvdb_id'
			}
		});

		show.save(function (err, show) {
			if (err) return console.error(err);
			console.dir(show.SeriesName + ' - added successfully');
		});
	};

	var title = Object.keys(showRaw)[0];
	model.Show.findOne({ title: title }, function(err, showDB) {
		if (!showDB || (showDB && showDB.tvdb && !showDB.tvdb.isSet)) {

			tvdbRequest(showRaw).then(function(merged) {
				doInsert(merged);
			}, function (e) {
				console.warn(e);
				setTimeout(function () {
					model.rawToDatabase(showRaw);
				}, 5000);

			});
		}
	});
};