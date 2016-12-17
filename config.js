const config = {
  telegramOptions: {
    token: '271592652:AAHffuT2igS0b9TeLtnRgOp1yn34Wxdqm_Q'
  },
  db: 'mongodb://localhost/travelbot',
  populateDB: {
    cronRule: '*/5 * * * *' // Run every five minutes
  },
  sendMessages: {
    cronRule: '*/10 * * * *' // Run every ten minutes
  }
};

module.exports = config;
