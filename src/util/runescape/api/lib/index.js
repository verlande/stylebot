
const API = require('./api');

const rs = new API('rs');

const RuneScapeAPI = {};

Object.defineProperty(RuneScapeAPI, 'rs', {
  get() {
    return rs;
  },
});

module.exports = RuneScapeAPI;
