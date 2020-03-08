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

module.exports = mongoose.model('Post', new Schema({
  author: {
    type: authorSchema, required: true,
  },
  content: {
    type: String, required: true,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}));
