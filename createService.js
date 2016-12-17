const { db, models } = require('./src/db');

const args = require('minimist')(process.argv.slice(2));

if (!args.feed) {
  console.error('Error: no --feed option provided');
  process.exit(0);
}

models.Service.create({
  feedUrl: args.feed,
  url: args.url,
  })
  .then(data => console.log('Success'))
  .catch(error => console.log('Error', error));