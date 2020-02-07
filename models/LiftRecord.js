const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('LiftRecord', new Schema({
  excercise: {
    type: String, required: true,
  },
  weight: {
    type: String, required: true,
  },
  reps: {
    type: String, required: true,
  },
  videoData: {
    type: String, required: false,
  },
}));
