## Telegram bot 

Bot sends notifications for given keywords. Collects data from rss channels. 

## Run

``npm start`` - starts bot app

``npm run populateDB`` - starts data collection app

``npm run sendMessages`` - starts app responsible for dispatching messages to subscribed users

``npm run createService -- --feed http://example.com/feed/ --url http://example.com`` - adds rss feed to collect data from