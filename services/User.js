const JWT = require('jsonwebtoken');
const Service = require('./Service');
const User = require('../models/User');
// Sign in echange email and password for token but do not create account

// Sign up : exchange email and password for token and create account

module.exports = class UserService extends Service {
  constructor() {
    super(User);
  }

  signToken(user) {
    return JWT.sign({
      iss: 'powerlifting-app', // Optional
      sub: user._id,
      iat: new Date().getTime(), // Optional
      exp: new Date().setDate(new Date().getDate() + 1), // Optional
    }, 'theowlsarenotwhattheyseem'); // Secret: should generate long randon string
  }

  async sendFreindRequest(from, to) {
    // TODO: Check if user tries to send request to himself
    new Promise(function(resolve, reject) {
      User.requestFriend(from, to, (err, response) => {
        if (err) reject(err)
        resolve(response);
      });
    });
  }

  async signUp(user) {
    return new Promise((resolve, reject) => {
      // TODO: Check if user exists
      const newUser = new User(user);

      newUser.save((err, user) => {
        if (err) {
          reject(err);
        } else {

          const token = JWT.sign({
            iss: 'powerlifting-app', // Optional
            sub: user._id,
            iat: new Date().getTime(), // Optional
            exp: new Date().setDate(new Date().getDate() + 1), // Optional
          }, 'theowlsarenotwhattheyseem'); // Secret: should generate long randon string
          resolve(token);
        }
      });
    });
  }

  // async getCurrentUser() {
  //   return signToken(user);
  // }
  //
  // async signIn(user) {
  //   return signToken(user);
  // }
}
