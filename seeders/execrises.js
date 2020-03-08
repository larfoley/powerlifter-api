import { Seeder } from 'mongoose-data-seed';
import Exercise from '../models/Exercise';

const data = [
  {
    name: 'Squat'
  },
  {
    name: 'Bench'
  },
  {
    name: 'Deadlift'
  },
];

var user = new UserModel({});



class ExercisesSeeder extends Seeder {
  async shouldRun() {
    return Exercise.countDocuments()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return Exercise.create(data);
  }
}

export default ExercisesSeeder;
