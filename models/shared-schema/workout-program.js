const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = new Schema({
  author: { type: String, required: true },
  name: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  weeks: {
    type: [new Schema({
      week: { type: Number, required: true },
      workouts: [new Schema({
        week: { type: Number},
        weekDay: { type: Number},
        day: { type: Number},
        completed: { type: Boolean },
        exercises: {
          type: [new Schema({
            exercise: { type: String },
            note: { type: String },
            sets: {
              type: [new Schema({
                order: { type: Number },
                targetReps: { type: Number },
                repsCompleted: { type: Number },
                tragetWeight: { type: Number },
                weightLifted: { type: Number },
                completed: { type: Boolean }
              })]
            },
          })]
        },
      })]
    })],
  },
})
