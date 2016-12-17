const models = require('./model');
const mongoose = require('mongoose');
const config = require('./../config');

mongoose.Promise = global.Promise;

mongoose.connect(config.db);
const db = mongoose.connection;

module.exports = { db, models };
