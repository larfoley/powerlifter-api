const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorSchema = new Schema({
  username: {
    type: String, required: true,
  },
  email: {
    type: String, required: true,
  },
})

module.exports = mongoose.model('Comment', new Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  content: {
    type: String, required: true,
  },
  author: {
    type: authorSchema, required: true,
  },
  createdAt: {
    type: String, required: true,
  },
}));
