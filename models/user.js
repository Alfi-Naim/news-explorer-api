const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { wrongEmailOrPasswordText } = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(wrongEmailOrPasswordText));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(wrongEmailOrPasswordText));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
