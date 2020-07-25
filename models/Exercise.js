const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  name: {
    type: String, required: true,
  },
  modality: {
    type: String,
    enum: ['Free Weights', 'Cables', 'Machine'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Advanced', 'Intermediate'],
    default: 'Beginner'
  },
  body: {
    type: String,
    enum: ['Upper Body', 'Lower Body', 'Core'],
  },
  pushPull: {
    type: String,
    enum: ['Push', 'Pull'],
  },
});

const ExerciseModel = mongoose.model('Exercise', ExerciseSchema);

module.exports = { ExerciseModel, ExerciseSchema }
