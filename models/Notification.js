const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Notification', new Schema({
  for: [mongoose.Schema.Types.ObjectId],
  text: {
    type: String, required: true,
  },
  link: {
    type: String, required: false,
  },
  isUnread: {
    type: Boolean, required: true, default: true
  },
  new: {
    type: Boolean, required: true, default: true
  },
}));
