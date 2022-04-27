const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;
const userSchema = new Schema({
  username: { type: String, required: true, unqiue: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hash;
  } catch (err) {
    return next({
      log: 'Error occurred with signup. Try again',
      message: { err: 'Must have a username and password' },
    });
  }
});

//Compare password
userSchema.methods.comparePassword = async function (password, next) {
  try {
    console.log('this: ', this);
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    return next({
      log: 'Error occurred with signup. Try again',
      message: { err: 'Must have a username and password' },
    });
  }
};

module.exports = mongoose.model('User', userSchema);
