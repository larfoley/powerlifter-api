const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Notification', new Schema({
  title: {
    type: String, required: true,
  },
  text: {
    type: String, required: true,
  },
  link: {
    type: String, required: false,
  },
  isUnread: {
    type: Boolean, required: true,
  },
}));
