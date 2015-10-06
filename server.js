
var app = require('./app');
var config = require('./configs/settings');
var log = require('./modules/log');
var mongo = require('./modules/db');
var bodyParser = require('body-parser');
var model = require('./modules/model');
const PORT=34700;

var express = require('express');

var api = express();

api.use(bodyParser.json());
api.use('/', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
	next();
});

api.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/dist/index.html');
});

api.get('/checkin', function (req, res) {
	app.getCheckIn().then(function (episodes) {
		res.send(success({
			episodes: episodes
		}));
	}, function (e) {
		res.send(error(e));
	});
});


api.get('/getShows', function (req, res) {
	app.getShows(req.query.force).then(function (shows) {
		res.send(success({
			shows: shows
		}));
	}, function (e) {
		res.send(error(e));
	});
});

api.get('/rss', function (req, res) {
	try {
		app.startRssProcess();
		res.send(success({
		}));
	} catch (e) {
		res.send(error(e));
	}
});

api.get('/flexget', function (req, res) {
	try {
		app.startFlexgetProcess().then(function () {
			app.updateConfig();
			res.send(success({}));
		});
	} catch (e) {
		res.send(error(e));
	}
});

api.get('/added', function (req, res) {
	mongo.connect().then(function (db) {
		db.collection('added').find().toArray(function (err, added) {
			if (err) {
				db.close();
				res.send(error(e));

			} else {
				db.close();
				res.send(success({
					added: added
				}));

			}
		});
	});
});

api.post('/show/save', function (req, res) {
	model.saveShow(req.body.show).then(function (show) {
		res.send(success({
			show: show
		}));
	}, function (e) {
		res.send(error(e));
	});
});

api.post('/show/delete', function (req, res) {
	model.deleteShow(req.body.show).then(function (show) {
		res.send(success({
			show: show
		}));
	}, function (e) {
		res.send(error(e));
	});
});

api.use(express.static(__dirname + "/client/dist/"));

api.get('/logs/forever', function(req, res) {
	app.foreverLog(1000).then(function (log) {
		res.send(success({
			log: log
		}));
	}, function (e) {
		res.send(error(e));
	});
});

api.get('/logs/flexget', function(req, res) {
	app.flexgetLog(3000).then(function (log) {
		res.send(success({
			log: log
		}));
	}, function (e) {
		res.send(error(e));
	});
});

api.listen(PORT, function () {
	var env = process.argv[2];
	log.debug('server', 'Environment set to ' + (env || 'local').toUpperCase());
	config.set(env);
	//Callback triggered when server is successfully listening. Hurray!
	log.debug('server', "Server listening on: http://localhost:" + PORT);
	app.start();
});


var error = function (e) {
	return JSON.stringify({
		success: false,
		error: e
	});
};

var success = function (obj) {
	obj.success = true;
	return JSON.stringify(obj);
};