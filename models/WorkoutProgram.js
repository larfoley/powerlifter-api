const mongoose = require('mongoose');
const workoutProgramSchema = require('./shared-schema/workout-program');

workoutProgramSchema.add({
  isActive: { type: Boolean, default: false },
  startedOn: { type: Date },
  completedOn: { type: Date },
})

module.exports = mongoose.model('WorkoutProgram', workoutProgramSchema);
