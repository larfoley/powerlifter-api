'use strict';
const fs = require('fs');
const got = require('got');

(async () => {

  const url = 'https://randomuser.me/api/?results=100';

  try {
    const { body } = await got(url, { responseType: 'json' });

    const users = body.results.map((result) => {
      const user = {
        email: result.email,
        username: result.login.username,
        password: 'letmein123',
        profilePic: result.picture.medium,
      }

      return user;
    })

    const doc = {
      'model': 'User',
      'documents': users
    }

    const fileData = `module.exports = ${JSON.stringify(doc)}`

    fs.writeFile('./seeds/users.js', fileData, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    console.log(fileData);

  } catch (error) {
    console.log(error);
  }

})();
