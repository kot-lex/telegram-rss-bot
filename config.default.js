const config = {
  telegramOptions: {
    token: process.env.TELEGRAM_TOKEN
  },
  db: process.env.MONGODB_URI,
  populateDB: {
    cronRule: '*/5 * * * *' // Run every five minutes
  },
  sendMessages: {
    cronRule: '*/10 * * * *' // Run every ten minutes
  }
};

module.exports = config;
