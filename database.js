// const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

async function connect(environment) {
  let databaseURI;
  let mongod;

  if (environment === 'production') {
    databaseURI = process.env.DB;

  } else {
    // mongod = new MongoMemoryServer();
    // databaseURI = await mongod.getUri();
  }

  databaseURI = process.env.DB;

  mongoose.connection.once('open', () => {
    console.log(`connected to the ${environment} database`);
  });

  mongoose.connection.on('error', console.error.bind(
    console,
    'Error connecting to the database'
  ));

  try {
    await mongoose.connect(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

 } catch (error) {
    console.log(error);
  }
}

module.exports = { connect }
