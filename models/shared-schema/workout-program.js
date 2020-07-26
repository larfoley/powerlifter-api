const mongoose = require('mongoose');

const { Schema } = mongoose;

const achievmentsSchema = new Schema({
  exercise: { type: String },
  reps: { type: Number },
  weight: { type: Number },
  achievedOn: { type: Date },
})

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
        guid: { type: String },
        week: { type: Number},
        weekDay: { type: Number},
        day: { type: Number},
        completed: { type: Boolean },
        exercises: {
          type: [new Schema({
            exercise: { type: String },
            note: { type: String },
            guid: { type: String },
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
        goalsAchieved: {
          type: [ achievmentsSchema ]
        },
        personalBestsAchieved: {
          type: [ achievmentsSchema ]
        }
      })]
    })],
  },
})
