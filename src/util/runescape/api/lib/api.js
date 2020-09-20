'use strict';

var GrandExchange = require('./apis/grandexchange');

function API(type) {
    var config = require('./configs/' + type);
    this.grandexchange = new GrandExchange(config.ge);
    this.ge = this.grandexchange;
}

module.exports = API;
