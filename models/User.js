const mongoose = require('mongoose');
const friends = require("mongoose-friends-plugin");
const validate = require('mongoose-validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const emailValidator = [
  validate({
    validator: 'isEmail',
  }),
];

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  isOnline: {
    type: Boolean,
    required: false
  },
  friendRequest: {
    type: String,
    required: false
  },
  friendRequestRecieved: {
    type: Boolean,
    required: false
  },
  friendRequestSent: {
    type: Boolean,
    required: false
  },
  isFriend: {
    type: Boolean,
    required: false
  },
  profilePic: {
    type: String,
    default: ''
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  workoutProgramTemplates: [{ type: Schema.Types.ObjectId, ref: 'WorkoutProgramTemplate' }],
  workoutHistory: [{ type: Schema.Types.ObjectId, ref: 'WorkoutProgram' }],
});

userSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(this.password, salt);

      this.password = passwordHash;
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = function(password) {
  const currentPassword = this.password ? this.password.trim() : this.password;
  const newPassword = password ? password.trim() : password;
  
  return bcrypt.compareSync(newPassword, currentPassword);
}

userSchema.statics.addFriendshipMetaData = function(currentUserFriends, user) {
  user.isFriend = false;
  user.friendRequestRecieved = false;
  user.friendRequestSent = false;
  user.friendRequest = null;

  currentUserFriends.forEach(friend => {

    if (friend._id.equals(user._id)) {

      const friendStatus = friend.status;

      friend.id = friend._id;
      user.friendRequest = friend._id;

      if (friendStatus === 'requested') {
        user.friendRequestSent = true;

      } else if (friendStatus === 'pending') {
        user.friendRequestRecieved = true;

      } else if (friendStatus === 'accepted') {
        user.isFriend = true;
      }
    }
  })


  return user;
}


userSchema.plugin(friends());

module.exports = mongoose.model('User', userSchema);
