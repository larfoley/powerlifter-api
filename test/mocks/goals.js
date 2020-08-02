const ObjectId = require('mongoose').Types.ObjectId;

const newGoal = {
  weight: 100,
  reps: 1,
  dueDate: "2020-08-01T09:57:37.138Z",
  exercise: { name: 'Deadlift' }
}

const goal = {
  _id: ObjectId().toString(),
  weight: 100,
  reps: 1,
  dueDate: "2020-08-01T09:57:37.138Z",
  exercise: { name: 'Deadlift' }
}

const goals = [
  {
    _id: ObjectId().toString(),
    weight: 100,
    reps: 1,
    dueDate: "2020-08-01T09:57:37.138Z",
    exercise: { name: 'Deadlift' },
  },
  {
    _id: ObjectId().toString(),
    weight: 50,
    reps: 5,
    dueDate: "2020-08-01T09:57:37.138Z",
    exercise: { name: 'Deadlift' },
  }
]

module.exports = {
  goals,
  newGoal
}
