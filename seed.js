require('dotenv').config();
const seeder = require('mongoose-seed');
const data = require('./seeds');

const seeds = [];

for (var seed in data) {
  seeds.push(data[seed])
}

const modelPaths = seeds.map(seed => `models/${seed['model']}.js`);
const modelNames = seeds.map(seed => seed['model']);

seeder.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, function() {

  seeder.loadModels(modelPaths);

  seeder.clearModels(modelNames, function() {

    seeder.populateModels(data, function() {
      console.log(data);
      seeder.disconnect(function(a, b) {
        console.log("disconnected");
        console.log(a, b);
      });
      console.log('done');
    });

  });
});
