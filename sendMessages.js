const { db, models } = require('./src/db');
const bot = require('./src/initBot');
const sanitizeHtml = require('sanitize-html');
const schedule = require('node-schedule');
const config = require('./config');

const scheduled = schedule.scheduleJob(config.sendMessages.cronRule, sendMessages);

function sendMessages() {
  console.log(new Date() + ' sendMessages started');

  models.User.find({ keywords: { $not: {$size: 0} } })
    .exec()
    .then(users => {
      const dealsPromises = users.map(getDeals);
      return Promise.all(dealsPromises)
    })
    .then(sendDeals)
    .catch(error => console.log(error));

}

function sendDeals(data) {

  const promises = data.map(item => {
    return messagePromises = item.deals.map(deal => {
      const message = sanitizeHtml(deal.title + '\n\n' + deal.text + ' \n\n' + deal.url, {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'code', 'pre' ],
      });
      return bot.sendMessage(
        item.user.telegramId, message,
        {
          parse: 'html',
          preview: false
        }
      );
    });
  });

  return Promise.all(promises);
}

function getDeals(user) {
  const sended = user.sendedAt;
  user.sendedAt = Date.now();
  user.save();

  return models.ServiceMessage.find({
    '$text':  { '$search': user.keywords.join(' ') },
    createdAt: { $gt: sended }
  })
    .then(deals => {
      console.log(deals.length + ' deals found');
      return Promise.resolve({
        user: user,
        deals: deals
      })
    });
}
