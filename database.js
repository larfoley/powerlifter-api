const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

async function connect(environment) {

  mongoose.connection.once('open', () => {
    console.log(`connected to the ${environment} database`);
  });
  mongoose.connection.on('error', console.error.bind(
    console,
    'Error connecting to the database'
  ));

  try {
    switch (environment) {
      case 'production':
        url = process.env.DB
        break;
      case 'development':
        uri = 'mongodb://localhost/dev';
        break;
      case 'test':
        uri = 'mongodb://localhost/test';
        break;
    }

    await mongoose.connect(process.env.DB, {
     useNewUrlParser: true,
     useUnifiedTopology: true
   });
 } catch (error) {
    console.log(error);
  }
}

module.exports = { connect }
