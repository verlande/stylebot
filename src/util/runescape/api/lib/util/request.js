'use strict';

var request = require('request'),
    Promise = require('promise'),
    jsonp = require('./jsonp'),
    async = require('async')

function Request() {
}

Request.prototype.csv = function (url) {
    return new Promise(function (resolve, reject) {
        request({
            url: url
        }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                var httpError = new Error('HTTP Code ' + response.statusCode);
                httpError.statusCode = response.statusCode;
                reject(httpError);
                return;
            }

            if (body.length === 0) {
                var bodyError = new Error('RuneScape API returned empty body');
                reject(bodyError);
                return;
            }

            var lines = [];

            body.split('\n').forEach(function (line) {
                if (line.length > 0) {
                    lines.push(line.split(','));
                }
            });

            resolve(lines);
        });
    });
};

Request.prototype.json = function (url, cookie) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: url,
            json: true
        };
        if (typeof cookie != 'undefined') {
            options.cookie = cookie;
        }
        request(options, function (error, response, json) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                var httpError = new Error('HTTP Code ' + response.statusCode);
                httpError.statusCode = response.statusCode;
                reject(httpError);
                return;
            }

            if (typeof json === 'undefined') {
                var jsonError = new Error('RuneScape API returned invalid json');
                reject(jsonError);
                return;
            }

            resolve(json);
        });
    });
};

Request.prototype.jsonp = function(url, cookie) {
    console.log(url);
    return new Promise(function (resolve, reject) {
        jsonp(url, cookie, 'jsonp', function(json) {
            if (json) {
                resolve(json);
            }
            else {
                var jsonError = new Error('RuneScape API returned invalid json');
                reject(jsonError);
                return;
            }
        });
    });
};

Request.prototype.wiki = function(url) {
    return new Promise(function (resolve, reject) {
        request({
            url: url
        }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                var httpError = new Error('HTTP Code ' + response.statusCode);
                httpError.statusCode = response.statusCode;
                reject(httpError);
                return;
            }

            if (body.length === 0) {
                var bodyError = new Error('RuneScape API returned empty body');
                reject(bodyError);
                return;
            }

            resolve(body);
        });
    });
};

Request.prototype.rscript = function(url) {
    console.log(url);
    return new Promise(function (resolve, reject) {
        request({
            url: url
        }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                var httpError = new Error('HTTP Code ' + response.statusCode);
                httpError.statusCode = response.statusCode;
                reject(httpError);
                return;
            }

            if (body.length === 0) {
                var bodyError = new Error('RuneScape API returned empty body');
                reject(bodyError);
                return;
            }

            var lines = [];

            body.split('\n').forEach(function (line) {
                if (line.includes(':') && !line.includes('PHP:')) {
                    lines.push(line.split(' '));
                }
            });

            resolve(lines);
        });
    });
};

module.exports = new Request();
