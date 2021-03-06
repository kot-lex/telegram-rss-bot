const { db } = require('./src/db');
const models = require('./src/model');
const config = require('./config');
const createUser = require('./src/createUser');
const bot = require('./src/initBot');

let currentUser = null;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

  bot.on(['/start', '/back'], msg => {

    let markup = bot.keyboard([
      [bot.button('/start', 'Настройки')]
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'Привет', { markup });

  });

  bot.on('/start', msg => {

    console.log('start');
    const id = msg.from.id;

    // Ask user name
    return bot.sendMessage(id, 'Ключевые слова?', { ask: 'keywords' });

  });

  bot.on('/search', msg => {

    console.log('search');
    const id = msg.from.id;

    return bot.sendMessage(id, 'Запрос', { ask: 'searchQuery' });

  });


  bot.on('ask.searchQuery', msg => {

    models.ServiceMessage.find({ '$text':  { '$search': msg.text } })
      .exec()
      .then(results => {
         bot.sendMessage(msg.from.id, 'Найдено предложений: ' + results.length).then(() => {

         const messagePromises = results.map(item => {
           return bot.sendMessage(msg.from.id, item.title + '\n\n' + item.text + ' \n\n' + item.url);

         });

         Promise.all(messagePromises)
           .catch(error => console.error(error));

        })
           .catch(error => console.error(error));
      })
      .catch(error => console.error(error));

  });

  bot.on('ask.keywords', msg => {

    const id = msg.from.id;
    const keywords = msg.text;

    const keywordsArray = keywords.split(',').map(item => item.trim());
    if (keywordsArray.length > 0) {
      currentUser
        .set('keywords', keywordsArray)
        .save()
        .then(data => console.log('keywords saved'));

      return bot.sendMessage(
        id, `Спасибо, буду присылать уведомления по ключевым словам: ${ keywords }!`);
    } else {
      return bot.sendMessage(id, 'Чет не нашли ключевых слов, ннну?', { ask: 'keywords' });
    }
  });

  // Save every message
  bot.on('text', msg => {
    models.User.findOne({ 'telegramId':  msg.from.id })
      .exec()
      .then(
        data => {
          return data ? data : createUser(msg)
        }
      ).then(user => {
        currentUser = user;
        const message = new models.UserMessage({
          text: msg.text,
          messageDate: msg.date,
          user: currentUser._id
        });

        return message.save()
    })
      .then(data => console.log('Message saved'))
      .catch(error => console.log('error', error));
  });

  bot.connect();
});