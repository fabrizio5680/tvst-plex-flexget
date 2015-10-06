var $q = require('q');
var rest = require('restler');
var xml2js = require('xml2js');
var utils = require('./utils');
var client = require('./client');
var fs = require('fs');
var mango = require('./db');
var score = require('string_score');
var moment = require('moment');
var rss = module.exports = {};

var options = null;

/**
 * HTTP GET request
 * @returns {Promise.promise|*}
 */
rss.getRSS = function (url) {
	var d = $q.defer();

	client.get(url).then(function (rss) {
		d.resolve(rss);
	});

	return d.promise;
};


rss.start = function (config) {
	var d = $q.defer();
	if (!config) {
		console.warn('[RSS] rssConfig missing')
		d.reject();
		return d.promise;
	}

	options = config;


	var d = $q.defer();
	rss.getRSS(options.url).then(function (xml) {
		var items = utils.findValueByKeyInObject(xml, 'item');
		processItems(items);
		d.resolve();
	}, function () {
		// todo
		d.reject();
	});

	return d.promise;
};

/**
 * Process Item
 * @param item
 */
var processItem = function (item) {
	var torrent = null;
	var approve = null;
	// Match Tags
	var tagMath = matchTags(item);
	// Match Title
	var titleMatch = matchTitle(item);

	var size = parseFloat(utils.findValueByKeyInObject(item, options.settings.size)[0]);
	// 6GB
	if (size > 6000000000) {
		approve = false;
	}


	if (titleMatch.success || tagMath.success) {
		try {
			var title = utils.findValueByKeyInObject(item, 'title');
			title = title && title.length > 0 ? title[0] : typeof title === 'string' ? title : 'undefined';
			torrent = {
				matchedTags: tagMath.tags,
				matchedTitle: titleMatch.title,
				title: title,
				sanitizedTitle:title.toLowerCase().replace(/[^a-zA-Z0-9\s]+/g, " "),
				download: utils.findValueByKeyInObject(item, options.settings.download),
				size: size,
				quality: utils.findQuality(title),
				expireAt: moment().add(2, 'w').toDate()
			};
		} catch (e) {
			console.warn('[RSS] error processing item', e);
		}
	}

	return torrent;
}

var processItems = function (items) {
	var toInsert = [];
	for (var i = 0; i < items.length; i++) {
		var itm = processItem(items[i]);
		if (itm) {
			toInsert.push(itm);
			console.log(JSON.stringify(itm, 2))
		}
	}

	if (toInsert.length === 0) {
		return;
	}

	mango.connect().then(function (db) {
		db.collection(options.settings.collection).find().toArray(function (err, fromDb) {
			//db.collection(options.settings.collection).remove( { } );
			db.collection(options.settings.collection).createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } );
			var approved = sampleForDuplicates(toInsert, fromDb);
			//var emp = db.collection(options.settings.collection).insertMany(approved);
			db.close();
		});
	}, function (e) {
		console.warn('[RSS] DB error connection process items', e)
	});
};


// todo replicate array and remove each item itself while iterating
var sampleForDuplicates = function (potentialCandidates, currentlyStored) {

	var toInsert = [];
	var potential = null;
	var fromDb = null;
	var i, j;
	//var listToTest = potentialCandidates.slice();
	var dupes = []
	var noDupes = [];
	var joined = currentlyStored;

	var collectScores = function (potent, sc) {
		console.log(sc, potential.sanitizedTitle + ' vs ' + fromDb.sanitizedTitle);
		potent.scores = potent.scores || [];
		potent.scores.push(sc);
	};

	var siftDuplicatesAndNon = function (item1) {
		var i;
		var item2;
		var itemSelected;

		for (i = 0; i < potentialCandidates.length; i++) {
			item2 = potentialCandidates[i];
			try {
				var s = item1.sanitizedTitle.score(item2.sanitizedTitle, 1);
				console.log(s, item1.sanitizedTitle + ' vs ' + item2.sanitizedTitle);
				if (s > 0.85 && s < 1) {
					dupes.push(item1);
				}
			} catch (e) {
				console.warn(e);
			}
		}

		for (i = 0; i < dupes.length; i++) {
			var quality = utils.findValueByKeyInObject(dupes[i], 'quality');
			if (quality === 720 && !itemSelected) {
				itemSelected = dupes[i]
			}
		}

		if (dupes.length === 0) {
			noDupes.push(item1);
		}

		return dupes;
	};


	// Step 1 - Sift Duplicates and Non Duplicates
	for (i = 0; i < potentialCandidates.length; i++) {
		dupes = siftDuplicatesAndNon(potentialCandidates[i]);
	}

	// Step 2 - Remove duplicates found in dupe
	dupes = dupes.removeDuplicates('sanitizedTitle');

	// Step 3 - Filter out quality in dupe

	return toInsert;
	//
	//
	//
	//
	//for (i = 0; i < potentialCandidates.length; i++) {
	//	potential = potentialCandidates[i];
	//	for (j = 0; j < joined.length; j++) {
	//		fromDb = joined[j];
	//		try {
	//			var s = potential.sanitizedTitle.score(fromDb.sanitizedTitle, 1);
	//			collectScores(potential, s);
	//		} catch (e) {
	//
	//		}
	//	}
	//}
	//
	//
	//for (i = 0; i < potentialCandidates.length; i++) {
	//
	//	var failed = false;
	//
	//	potential = potentialCandidates[i];
	//
	//	for (j = 0; j < potential.scores.length; j++) {
	//		var score = potential.scores[j];
	//		if (score > 0.85 && score < 1) {
	//			console.warn(potential.title + ' failed', score);
	//			failed = true;
	//		}
	//	}
	//
	//	if (!failed) {
	//		toInsert.push(potential);
	//	}
	//}



}

/**
 * Match Single Tags
 * @param item
 * @returns {*}
 */
var matchTags = function (item) {
	var accept = null;
	var t = [];
	var tags = utils.findValueByKeyInObject(item, 'tags');

	tags = tags[0].split(' ');

	for (var i = 0; i < options.tags.length; i++) {
		var configTag = options.tags[i];
		for (var j = 0; j < tags.length; j++) {
			var xmlTag = tags[j];
			try {
				if (xmlTag.match(configTag)) {
					accept = true;
					t.push(configTag);
				}
			} catch (e) {
				console.log(e);
			}
		}
	}

	return {
		success: accept,
		tags: t
	};
};

/**
 * Match Title
 * @param item
 * @returns {*}
 */
var matchTitle = function (item) {
	var accept = null;
	var t = [];
	var title = utils.findValueByKeyInObject(item, 'title');

	for (var i = 0; i < options.title.length; i++) {
		var configTitle = options.title[i];

		try {
			if (title[0].match(configTitle)) {
				accept = true;
				t.push(configTitle);
			}
		} catch (e) {
			console.log(e);
		}
	}

	return {
		success: accept,
		title: t
	};
};

