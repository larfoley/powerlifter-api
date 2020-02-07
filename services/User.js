const JWT = require('jsonwebtoken');
const Service = require('./Service');
const User = require('../models/User');
const createError = require('http-errors')

module.exports = class UserService extends Service {
  constructor() {
    super(User);
  }

  async findAll(query) {
    const users = await User.find(query).select('-password');

    // for (const user of users) {
    //   user.friends = await this.getAcceptedFriends(user);
    //   user.pendingFriends = await this.getPendingFriends(user);
    //   user.requestedFriends = await this.getRequestedFriends(user);
    // }

    return users;
  }

  async search(searchTerm) {
    const users = await User.find(query).select('-password');
  }

  signToken(user) {
    return JWT.sign({
      iss: 'powerlifting-app', // Optional
      sub: user._id,
      iat: new Date().getTime(), // Optional
      exp: new Date().setDate(new Date().getDate() + 1), // Optional
    }, 'theowlsarenotwhattheyseem'); // Secret: should generate long randon string
  }

  getAcceptedFriends(user) {
    return new Promise(function(resolve, reject) {
      User.getAcceptedFriends(user, (err, response) => {
        if (err) reject(err)
        resolve(response);
      });
    });
  }

  getPendingFriends(user) {
    return new Promise(function(resolve, reject) {
      User.getPendingFriends(user, (err, response) => {
        if (err) reject(err)
        resolve(response);
      });
    });
  }

  getRequestedFriends(user) {
    return new Promise(function(resolve, reject) {
      User.getRequestedFriends(user, (err, response) => {
        if (err) reject(err)
        resolve(response);
      });
    });
  }

  async sendFreindRequest(from, to) {
    // TODO: Check if user tries to send request to himself
    
    return new Promise(function(resolve, reject) {
      if (from === to) {
        reject(createError(422, 'You cannot send a friend request to yourself'))
      }

      User.requestFriend(from, to, (err, response) => {
        if (err) {
          reject(err);
        }

        resolve(response);
      });
    });
  }
}
