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

const fileSchema = new Schema({
  mediaType: {
    type: String, required: true,
  },
  url: {
    type: String, required: true,
  },
})

const likesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, required: true,
  },
  post: {
    type: Schema.Types.ObjectId, required: true,
  },
})

const postSchema = new Schema({
  content: {
    type: String, required: true,
  },
  media: {
    type: new Schema({
      mediaType: {
        type: String, required: true,
      },
      url: {
        type: String, required: true,
      },
    })
  },
  author: {
    type: authorSchema
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: likesSchema,
  }],
},{
  timestamps: true
})

module.exports = mongoose.model('Post', postSchema);
