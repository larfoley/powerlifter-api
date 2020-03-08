const mongoose = require('mongoose');
const Exercises = require('./seeders/exercises');

const mongoURL = process.env.DB || 'mongodb://localhost:27017/dbname';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
module.exports = {
  Exercises
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
const connect = async () => await mongoose.connect(mongoURL, { useNewUrlParser: true });

// export const dropdb = async () => mongoose.connection.db.dropDatabase();
