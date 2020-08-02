const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

async function connect() {
  mongoose.set('useFindAndModify', false);

  try {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
      console.log(error);
  }
}

module.exports = { connect }
