const TeleBot = require('telebot');
const ask = require('telebot/modules/ask');
const config = require('./config');

const bot = new TeleBot(config.telegramOptions);
bot.use(ask);

module.exports = bot;
