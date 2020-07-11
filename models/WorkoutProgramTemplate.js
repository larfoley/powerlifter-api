const mongoose = require('mongoose');
const workoutProgramSchema = require('./shared-schema/workout-program');

module.exports = mongoose.model('WorkoutProgramTemplate', workoutProgramSchema);
