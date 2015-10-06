/**
 * Created by fabrizio on 14/08/15.
 */
var $q = require('q');
var xml2js = require('xml2js');
var fs = require('fs');
var http = require('http')

var utils = module.exports = {};


Array.prototype.removeDuplicates = function (param) {
	var arr = this;
	arr.sort( function( a, b){ return a[param] - b[param]; } );

// delete all duplicates from the array
	for( var i = 0; i < arr.length - 1; i++ ) {
		if ( arr[i][param] == arr[i+1][param] ) {
			delete arr[i];
		}
	}

// remove the "undefined entries"
	arr = arr.filter( function( el ){ return (typeof el !== "undefined"); } );

	return arr;
};

utils.parseXmlToJson = function (xml) {
	var d = $q.defer();
	try {
		xml2js.parseString(xml, function (err, data) {
			d.resolve(data);
		});
	} catch (e) {
		console.warn('[Utils] parse xml error: ', e);
		d.reject(e);
	}
	return d.promise;
};


utils.downloadFile = function (url) {
	var file = fs.createWriteStream("file.jpg");
	var request = http.get(url, function(response) {
		response.pipe(file);
	});
}

/**
 * key value search
 * @param obj
 * @param key
 * @returns {*}
 *
 *
 */

utils.findQuality = function (title) {
	var match = title.match(/\[?\d+p\b]?/g);

	return match && match.length > 0 ? match[0] : null;
};

utils.findValueByKeyInObject = function(obj, getKey) {
	var value = null;

	if (!obj) {
		console.warn('[Utils] missing object in findValueByKeyInObject');
	}

	var child = function (obj, getKey) {
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {

				if (getKey === key) {
					value = obj[key];
				}

				if (typeof obj[key] === 'object' ) {
					value = child(obj[key], getKey);
				}
			}
		}
		return value;
	}


	value = child(obj, getKey);

	return value;
};
