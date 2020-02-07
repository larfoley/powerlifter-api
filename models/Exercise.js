const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Exercise', new Schema({
  name: {
    type: String, required: true,
  },
}));
