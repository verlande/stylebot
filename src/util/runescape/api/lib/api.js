
const GrandExchange = require('./apis/grandexchange');

function API(type) {
  const config = require(`./configs/${type}`);
  this.grandexchange = new GrandExchange(config.ge);
  this.ge = this.grandexchange;
}

module.exports = API;
