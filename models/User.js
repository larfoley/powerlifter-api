const mongoose = require('mongoose');
const friends = require("mongoose-friends");
const validate = require('mongoose-validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;
const emailValidator = [
  validate({
    validator: 'isEmail',
  }),
];
const schema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true
  }
});

schema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);

    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

schema.methods.verifyPassword = function(newPassword) {
    return bcrypt.compareSync(newPassword, this.password);
}

schema.plugin(friends());

module.exports = mongoose.model('User', schema);
