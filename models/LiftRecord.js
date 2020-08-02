const mongoose = require('mongoose');
const { ExerciseSchema } = require('./Exercise');
const { Schema } = mongoose;

const LiftRecordSchema = new Schema({
  exercise: {
    type: ExerciseSchema, required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  weightLifted: {
    type: Number, required: true,
  },
  reps: {
    type: Number, required: true,
  },
  videoURL: {
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
