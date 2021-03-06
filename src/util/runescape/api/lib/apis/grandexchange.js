
const Promise = require('promise');
const request = require('../util/request');
const sp = require('../util/string');

/**
 * Module containing Grand Exchange functions
 * @module Grand Exchange
 */
function GrandExchange(config) {
  // Read the RScript data and put it into an item array
  const readRscriptData = function (data) {
    const items = [];
    data.forEach((d, i) => {
      if (d.includes('ITEM:') && d.length > 3) {
        const iid = data[i + 1];
        const item = {
          item: {
            id: Number(iid[1].trim()),
            name: d[2].replace(/_/g, ' '),
            price: d[3],
            change: d[4],
          },
        };
        items.push(item);
      }
    });
    return items;
  };

  /**
     * Returns an object containing the number of items in the category for each starting letter (available for `rs` / `osrs`)
     * @param  key {String|Number} The category id or name
     * @returns {Object} Items in the category
     * @example
     * // returns items object for the Miscellaneous category
     * rsapi.rs.ge.category('Miscellaneous').then(function(category) {
     *  console.log(category);
     * }).catch(console.error);
     */
  this.category = function (key) {
    let id;

    if (typeof key === 'string') {
      id = typeof key === 'string' ? config.categories.indexOf(key) : key;
    }

    return new Promise(((resolve, reject) => {
      request.json(config.urls.category + id).then(resolve).catch(reject);
    }));
  };

  /**
     * Gets items in a category starting with a specific prefix (available for `rs` / `osrs`)
     * @param  key {String|Number} The category id or name
     * @param  prefix {String} An item's prefix
     * @param  page {Number} Page number
     * @returns {Object} Items starting with a specific prefix
     * @example
     * // returns items object for items starting with A
     * rsapi.rs.ge.categoryPrices(0, 'a', 1).then(function(category) {
     *  console.log(category);
     * }).catch(console.error);
     */
  this.categoryPrices = function (key, prefix, page) {
    let id;

    if (typeof key === 'string') {
      id = typeof key === 'string' ? config.categories.indexOf(key) : key;
    }
    return new Promise(((resolve, reject) => {
      request.json(`${config.urls.categoryPrice}category=${id}&alpha=${prefix}&page=${page}`).then(resolve).catch(reject);
    }));
  };

  /**
     * Gets the graph price information for each day for 180 days (available for `rs` / `osrs`)
     * @param  item {Number} An item id
     * @returns {Object} Graph price information over the last 180 days
     * @example
     * // returns items object for items starting with A
     * rsapi.rs.ge.categoryPrices(0, 'a', 1).then(function(category) {
     *  console.log(category);
     * }).catch(console.error);
     */
  this.graphData = function (item) {
    return new Promise(((resolve, reject) => {
      request.json(`${config.urls.graph + item}.json`).then(resolve).catch(reject);
    }));
  };

  /**
     * Get an items current price, its price trend over 30, 90, and 180 days as well as its category and image urls (available for `rs` / `osrs`)
     * @param item As item id
     * @returns {Object} Item's pricing information
     * @example
     * api.rs.ge.graphData(4151).then(function(item) {
     *  console.log(item.daily, item.average);
     * }).catch(console.error);
     */
  this.itemInformation = function (item) {
    return new Promise(((resolve, reject) => {
      request.json(config.urls.information + item).then(resolve).catch(reject);
    }));
  };

  /**
     * Get rscripts data for item(s) matching the name passed in (available for `rs`)
     * @param  name {String} An item name or part of an item name
     * @returns {Array} Array contains item objects. Can return multiple items in the array.
     * @example
     * //returns an array of all items found on the ge containing the word noxious
     * api.rs.ge.itemId('noxious').then(function(item) {
     *  console.log(item.daily, item.average);
     * }).catch(console.error);
     */
  this.itemId = function (name) {
    return new Promise(((resolve, reject) => {
      request.rscript(config.urls.rscript + encodeURIComponent(name)).then((data) => {
        const items = readRscriptData(data);
        resolve(items);
      }).catch(reject);
    }));
  };

  /**
     * Gets item information using RS Wiki data. (available for `rs`)
     * @param item
     * @returns {Object} Object of the item data stored by RS Wiki
     * @example
     * api.rs.ge.getItem('mazcab ability codex').then(function(item) {
     *  console.log(item);
     * }).catch(console.error);
     */
  this.getItem = function (item) {
    return new Promise(((resolve, reject) => {
      const formattedItem = item.replace(/ /g, '_').trim();
      // as is (replacing spaces with underscores)
      request.wiki(`${config.urls.wiki}${formattedItem}?action=raw`).then((data) => {
        resolve(generateItem(data));
      }).catch((err) => {
        if (err.statusCode === 404) {
          const formattedItem = item.toTitleCase().replace(/ /g, '_').trim();
          // titlecase then replace spaces
          request.wiki(`${config.urls.wiki}${formattedItem}?action=raw`).then((data) => {
            resolve(generateItem(data));
          }).catch((err) => {
            if (err.statusCode === 404) {
              const formattedItem = item.toLowerCase().replace(/ /g, '_').toTitleCase().trim();
              // lower everything, replace spaces, then title case the first character
              request.wiki(`${config.urls.wiki}${formattedItem}?action=raw`).then((data) => {
                resolve(generateItem(data));
              }).catch(reject);
            }
          });
        }
      });
    }));
  };

  var generateItem = function (data) {
    const obj = {};
    data.split('\n').forEach((line) => {
      const ticks = line.split('\'');
      const tl = line.trim().replace(/'/g, '').replace('nil', '0');
      const prop = tl.indexOf('=') > -1 ? tl.substring(0, tl.indexOf('=')) : undefined;
      if (typeof prop !== 'undefined' && prop.trim() !== 'usage') {
        const lastChar = tl.substring(tl.length, tl.length).indexOf(',') > -1 ? tl.length - 2 : tl.length - 1;
        const val = `${tl.substring(tl.indexOf('=') + 1, lastChar).trim()}`;
        const isNumber = ticks.length < 2;
        obj[prop.trim()] = isNumber ? (val === 'true' || val === 'false' ? toBoolean(val) : Number(val)) : val;
      }
    });
    return obj;
  };

  var toBoolean = function (s) {
    return s === 'true';
  };
}

module.exports = GrandExchange;
