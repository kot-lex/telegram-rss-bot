const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userMessageSchema = new Schema({
  text:   String,
  messageDate: Number,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  date: { type: Date, default: Date.now }
});


const serviceSchema = new Schema({
  title:  String,
  text:   String,
  url: {
    type: String,
    trim: true,
    unique: true
  },
  feedUrl: {
    type: String,
    unique: true,
    trim: true
  },
  feedType: {
    type: String,
    default: 'rss'
  },
  messageDate: Date,
  createdAt: { type: Date, default: Date.now }
});


const serviceMessageSchema = new Schema({
  title:  String,
  text:   String,
  url: {
    type: String,
    trim: true,
    unique: true
  },
  service: {
    type: Schema.ObjectId,
    ref: 'Service'
  },
  messageDate: Date,
  createdAt: { type: Date, default: Date.now }
});

serviceMessageSchema.index({ title: 'text', text: 'text'},  { default_language: "russian" });

const userSchema = {
  telegramId: {
    type: Number,
    unique: true
  },
  firstName: String,
  lastName: String,
  username: {
    type: String,
    unique: true
  },
  keywords: [String],
  sendedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }

};

const models = {
  User: mongoose.model('User', userSchema),
  UserMessage: mongoose.model('UserMessage', userMessageSchema),
  Service: mongoose.model('Service', serviceSchema),
  ServiceMessage: mongoose.model('ServiceMessage', serviceMessageSchema)
};

module.exports = models;
