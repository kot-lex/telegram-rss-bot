const { db, models } = require('./src/db');
const request = require('request');
const FeedParser = require('feedparser');
const EventEmitter = require('events');
const schedule = require('node-schedule');
const config = require('./config');

const feedData = new EventEmitter();

const scheduled = schedule.scheduleJob(config.populateDB.cronRule, () => feedData.emit('scheduledRun'));

feedData.on('scheduledRun', doPopulate);

feedData.on('item', data => saveMessage(data));

function doPopulate() {
  console.log(new Date() + ' doPopulate started');
  models.Service
    .find({})
    .exec()
    .then(data => {
      data.forEach(item => getFeedData(item, feedData));
    });
}

function saveMessage(data) {
  models.ServiceMessage.create({
    title: data.item.title,
    text: data.item.description,
    url: data.item.link,
    service: data.service._id,
    createdAt: new Date()
  })
    .then(
      () => console.log('success'),
      error => {}
    );
}

function getFeedData(serviceItem, feedData) {
  const req = request(serviceItem.feedUrl);
  const feedparser = new FeedParser();

  req.on('error', function (error) {
    console.log('Request error');
  });
  req.on('response', function (res) {
    const stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });

  feedparser.on('error', function(error) {
    console.log('Feedparser error', error);
  });

  feedparser.on('readable', function() {
    // This is where the action is!
    const stream = this;
    let item;

    while (item = stream.read()) {
      feedData.emit('item', {
        service: serviceItem,
        item: item
      });
    }

  });
}
