const config = {
  telegramOptions: {
    token: "YOURTOKENHERE"
  },
  db: 'mongodb://localhost/bot',
  populateDB: {
    cronRule: '*/5 * * * *' // Run every five minutes
  },
  sendMessages: {
    cronRule: '*/10 * * * *' // Run every ten minutes
  }
};

module.exports = config;
