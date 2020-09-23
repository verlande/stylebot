
const request = require('request');
const Promise = require('promise');
const async = require('async');
const jsonp = require('./jsonp');

function Request() {
}

Request.prototype.csv = function (url) {
  return new Promise(((resolve, reject) => {
    request({
      url,
    }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode !== 200) {
        const httpError = new Error(`HTTP Code ${response.statusCode}`);
        httpError.statusCode = response.statusCode;
        reject(httpError);
        return;
      }

      if (body.length === 0) {
        const bodyError = new Error('RuneScape API returned empty body');
        reject(bodyError);
        return;
      }

      const lines = [];

      body.split('\n').forEach((line) => {
        if (line.length > 0) {
          lines.push(line.split(','));
        }
      });

      resolve(lines);
    });
  }));
};

Request.prototype.json = function (url, cookie) {
  return new Promise(((resolve, reject) => {
    const options = {
      url,
      json: true,
    };
    if (typeof cookie !== 'undefined') {
      options.cookie = cookie;
    }
    request(options, (error, response, json) => {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode !== 200) {
        const httpError = new Error(`HTTP Code ${response.statusCode}`);
        httpError.statusCode = response.statusCode;
        reject(httpError);
        return;
      }

      if (typeof json === 'undefined') {
        const jsonError = new Error('RuneScape API returned invalid json');
        reject(jsonError);
        return;
      }

      resolve(json);
    });
  }));
};

Request.prototype.jsonp = function (url, cookie) {
  console.log(url);
  return new Promise(((resolve, reject) => {
    jsonp(url, cookie, 'jsonp', (json) => {
      if (json) {
        resolve(json);
      } else {
        const jsonError = new Error('RuneScape API returned invalid json');
        reject(jsonError);
      }
    });
  }));
};

Request.prototype.wiki = function (url) {
  return new Promise(((resolve, reject) => {
    request({
      url,
    }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode !== 200) {
        const httpError = new Error(`HTTP Code ${response.statusCode}`);
        httpError.statusCode = response.statusCode;
        reject(httpError);
        return;
      }

      if (body.length === 0) {
        const bodyError = new Error('RuneScape API returned empty body');
        reject(bodyError);
        return;
      }

      resolve(body);
    });
  }));
};

Request.prototype.rscript = function (url) {
  console.log(url);
  return new Promise(((resolve, reject) => {
    request({
      url,
    }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode !== 200) {
        const httpError = new Error(`HTTP Code ${response.statusCode}`);
        httpError.statusCode = response.statusCode;
        reject(httpError);
        return;
      }

      if (body.length === 0) {
        const bodyError = new Error('RuneScape API returned empty body');
        reject(bodyError);
        return;
      }

      const lines = [];

      body.split('\n').forEach((line) => {
        if (line.includes(':') && !line.includes('PHP:')) {
          lines.push(line.split(' '));
        }
      });

      resolve(lines);
    });
  }));
};

module.exports = new Request();
