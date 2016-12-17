const defaultConfig = require('./config.default');
const config = {
  //put your configuration here
};

const mergedConfig = Object.assign({}, defaultConfig, config);

module.exports = mergedConfig;
