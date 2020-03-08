const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Comment', new Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  content: {
    type: String, required: true,
  },
  createdAt: {
    type: String, required: true,
  },
}));
