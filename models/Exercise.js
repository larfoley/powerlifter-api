const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  name: {
    type: String, required: true,
  },
  category: {
    type: String,
    enum: ['barbell'],
    required: true,
    default: 'barbell'
  },
});

const ExerciseModel = mongoose.model('Exercise', ExerciseSchema);

module.exports = { ExerciseModel, ExerciseSchema }
