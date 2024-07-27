const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  language: String,
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'history',
      default: [],
    },
  ],
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'favourites',
      default: [],
    },
  ],
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
