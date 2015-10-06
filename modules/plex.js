var config = require('./../configs/settings');
var $q = require('q');
var client = require('./client');
var utils = require('./utils');
var xml2js = require('xml2js');
var Tail = require('always-tail');
var log = require('./log');

var plex = module.exports = {};


var VIEW_COUNT = 'viewCount';
var cachedXML = null;
/**
 * Get Plex Media Log
 * @returns {Promise.promise|*}
 */
plex.tailPlexMediaLog = function (file, callback) {
	if (!file) {
		log.error('plex', 'No config Logfile present');
	}
	var tail = new Tail(file, '\n');

	tail.on('line', function(data) {
		if (callback) {
			callback(data)
		}
	});

	tail.on('error', function(data) {
		log.warn('Plex','Error tailing log' + data);
	});

	tail.watch();
};

/**
 * Get show info
 */
plex.getShowInfo = function (xml) {
	var viewCount = utils.findValueByKeyInObject(xml, VIEW_COUNT);
	var parent = utils.findValueByKeyInObject(xml, 'grandparentTitle');
	var lastViewedAt = utils.findValueByKeyInObject(xml, 'lastViewedAt');
	var art = utils.findValueByKeyInObject(xml, 'grandparentArt');

	var episode = utils.findValueByKeyInObject(xml, 'guid');
	var regex = /com.plexapp.agents.thetvdb:\/\/([0-9]+)\/([0-9]+)\/([0-9]+)\?.*/;

	return {
		'lastViewedAt': lastViewedAt,
		'parent': parent,
		'art': art, // + '?X-Plex-Token=QMHARuxedVkLMsEySe8g',
		'views': viewCount || 0,
		'show_id': episode.match(regex)[1],
		'season_number': episode.match(regex)[2],
		'number': episode.match(regex)[3]
	};
};



/**
 * Get view count
 * @param metaKey
 * @returns {Promise.promise|*}
 */
plex.getXMLDataFromPlex = function (metaKey, cached) {
	var d = $q.defer();

	if (!config.PLEX_SERVER) {
		log.error('plex', 'No config server url present');
	}

	var url = config.PLEX_SERVER + '/library/metadata/' + metaKey + '?X-Plex-Token=QMHARuxedVkLMsEySe8g';

	if (cached && cachedXML) {
		d.resolve(cachedXML);
		return d.promise;
	}

	client.get(url, null, true).then(function (xml) {
		utils.parseXmlToJson(xml).then(function (xml) {
			cachedXML = xml;
			d.resolve(xml);
		}, function (e) {
			d.reject(e);
		});
	});

	return d.promise;
};

