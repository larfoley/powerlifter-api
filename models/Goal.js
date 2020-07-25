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

// GoalSchema.statics.getPercentageCompleted = async function ({ exercise, reps, weight }) {
//
//   const pb = await LiftRecordModel.findPersonalBest(exercise.name, reps);
//
//   if (pb !== null) {
//     const percentageCompleted = Math.ceil(( pb.weightLifted / weight ) * 100);
//
//     if (percentageCompleted >= 100) {
//       return 100;
//     } else {
//       return percentageCompleted
//     }
//   }
//
//   return 0;
// };

// GoalSchema.pre('save', async function(next) {
//   try {
//     const pb = await LiftRecordModel.findPersonalBest(this.exercise.name, this.reps);
//
//     if (pb !== null) {
//       const percentageCompleted = Math.ceil(( pb.weightLifted / this.weight ) * 100);
//
//       if (percentageCompleted >= 100) {
//         this.set('percentageCompleted', 100);
//         this.set('isCompleted', true);
//       } else {
//         this.set('percentageCompleted', percentageCompleted);
//       }
//     } else {
//       this.set('percentageCompleted', 0);
//     }
//
//     next()
//   } catch (e) {
//     next(e);
//   }
// })

module.exports = mongoose.model('Goal', GoalSchema);
