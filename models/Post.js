const mongoose = require('mongoose');

const { Schema } = mongoose;

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
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  actionText: {
    type: String,
  },
  actionType: {
    type: String,
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
