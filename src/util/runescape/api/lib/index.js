'use strict';

var API = require('./api');

var rs = new API('rs');

var RuneScapeAPI = {};

Object.defineProperty(RuneScapeAPI, 'rs', {
    get: function() {
        return rs;
    }
});

module.exports = RuneScapeAPI;
