const mongoose = require('mongoose');

var init = {
  mongoose() {
    mongoose.Promise = global.Promise;

  }
};

module.exports = init;