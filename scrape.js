'use strict';

const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const result = excelToJson({
    sourceFile: 'resist_train_planner.xls'
});

const exercises = result['Exercise List']
  .filter((exercise, index) => index > 16 )
  .map(({ B, C, D, E, F, G, H }) => {

  return {
    name: C,
  }
});

const doc = {
  'model': 'Exercise',
  'documents': exercises
}

const fileData = `module.exports = ${JSON.stringify(doc)}`

fs.writeFile('./seeds/exercises.js', fileData, function (err) {
  if (err) throw err;
  console.log('Saved!');
});

console.log(exercises);
