const newLiftRecord = {
  weightLifted: 100,
  reps: 1,
  exercise: {
    name: 'Deadlift'
  }
}

const liftRecords = [
  {
    _id: '123',
    weightLifted: 100,
    reps: 1,
    exercise: {
      name: 'Deadlift'
    }
  },
  {
    _id: '124',
    weightLifted: 50,
    reps: 5,
    exercise: {
      name: 'Squat'
    }
  }
]

module.exports = {
  liftRecords,
  newLiftRecord
}
