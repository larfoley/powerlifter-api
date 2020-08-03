require('dotenv').config();
const seeder = require('mongoose-seed');
const data = require('./seeds');
const modelPaths = data.map(seed => `models/${seed['model']}.js`);
const modelNames = data.map(seed => seed['model']);

async function seed(databaseURI) {
  seeder.connect(databaseURI, { useNewUrlParser: true, useUnifiedTopology: true }, function() {

    seeder.loadModels(modelPaths);

    seeder.clearModels(modelNames, function() {

      seeder.populateModels(data, function() {
        seeder.disconnect(function(a, b) {
          console.log("disconnected");
        });
        console.log('done');
      });
    });
  });
}

seed(process.env.DB)
