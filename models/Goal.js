const mongoose = require('mongoose');
const { ExerciseSchema } = require('./Exercise');
const LiftRecordModel = require('./LiftRecord');
const { Schema } = mongoose;

const GoalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  exercise: {
    type: ExerciseSchema, required: true,
  },
  weight: {
    type: Number, required: true,
  },
  reps: {
    type: Number, required: true,
  },
  isCompleted: {
    type: Boolean, default: false,
  },
  completedOn: {
    type: Date
  },
  percentageCompleted: {
    type: Number, default: 0, max: 100, min: 0
  },
  dueDate: {
    type: Date, required: true
  },
  hasPreviouslyAchievedGoal: {
    type: Boolean, default: false
  },
}, {
  toJSON: { virtuals: true }
})

GoalSchema.virtual('isOverdue').get(function () {
  return this.dueDate <= new Date();
});

module.exports = mongoose.model('Goal', GoalSchema);
