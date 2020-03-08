const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Goal', new Schema({
  // excercise: {
  //   type: String, required: true,
  // },
  weight: {
    type: Number, required: true,
  },
  reps: {
    type: Number, required: true,
  },
}));
