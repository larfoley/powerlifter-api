const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Notification', new Schema({
  for: {
    type: Schema.Types.ObjectId, required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  from: {
    type: String, required: true,
  },
  text: {
    type: String, required: true,
  },
  link: {
    type: new Schema({
      route: { type: String },
      model: { type: String }
    }),
  },
  isUnread: {
    type: Boolean, required: true, default: true
  },
  new: {
    type: Boolean, required: true, default: true
  },
}, {
  timestamps: true
}));
