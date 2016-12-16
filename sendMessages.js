const { db, models } = require('./db');
const bot = require('./bot');
const sanitizeHtml = require('sanitize-html');

models.User.find({ keywords: { $not: {$size: 0} } })
  .exec()
  .then(users => {
    const dealsPromises = users.map(getDeals);
    return Promise.all(dealsPromises)
  })
  .then(sendMessages)
  .catch(error => console.log(error));


function sendMessages(data) {
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
  //user.sendedAt = Date.now();
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
