const mongoose = require('mongoose');
const { ExerciseSchema } = require('./Exercise');
const { Schema } = mongoose;

const LiftRecordSchema = new Schema({
  exercise: {
    type: ExerciseSchema, required: true,
  },
  weightLifted: {
    type: Number, required: true,
  },
  reps: {
    type: Number, required: true,
  },
  videoData: {
    type: String, required: false,
  },
  isPersonalBest: {
    type: Boolean, default: false
  },
  date: {
    type: Date, required: true
  }
}, {
  timestamps: true
})
//
// LiftRecordSchema.post('save', async function() {
//   // Check if newly added record has completed any goals
//
//   const query = {
//     'exercise.name': this.exercise.name,
//     isCompleted: false,
//     hasPreviouslyAchievedGoal: false,
//     reps: this.reps,
//     weight: { $lte: this.weightLifted }
//   }
//
//   const query2 = {
//     'exercise.name': this.exercise.name,
//     isCompleted: false,
//     hasPreviouslyAchievedGoal: true,
//     reps: this.reps,
//     weight: { $lte: this.weightLifted },
//     createdAt: { $gte: this.createdAt }
//   }
//
//   // await GoalModel.updateMany(query, {
//   //   isCompleted: true,
//   //   percentageCompleted: 100
//   // })
//   //
//   // await GoalModel.updateMany(query2, {
//   //   isCompleted: true,
//   //   percentageCompleted: 100
//   // })
//   console.log('Goal Model', GoalModel);
//
// })

LiftRecordSchema.statics.findPersonalBest = function(exercise, reps) {
  return this.find({'exercise.name': exercise, reps })
    .sort('-weightLifted')
    .findOne()
}

LiftRecordSchema.statics.updatePersonalBests = async function(exercise, reps) {
  const liftRecord = await this.find({'exercise.name': exercise, reps })
    .sort('-weightLifted')
    .findOne()

  await this.updateMany({'exercise.name': exercise, reps, isPersonalBest: true }, { isPersonalBest: false });
  await this.findByIdAndUpdate(liftRecord._id, { isPersonalBest: true }, { new: true } );
}


module.exports = mongoose.model('LiftRecord', LiftRecordSchema);
