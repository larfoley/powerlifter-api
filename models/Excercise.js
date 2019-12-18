const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('User', new Schema({
  name: {
    type: String, required: true,
  },
}));
