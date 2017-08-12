const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  // _id: {type: String},
  id : {type: String},
  name : {type: String, required: true},
  username : {type: String, required: true},
  passwordHash: {type: String}
});

// create an encrypted password for storage in database
userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

// individual users can authenticate their passwordHash
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// static method to authenticate a user
userSchema.statics.authenticate = function(username, password) {
  return (
    User.findOne({ username: username })
      // validate the user's password
      .then(user => {
        if (user && user.validatePassword(password)) {
          console.log('User and Password valid');
          return user;
        } else {
          return null;
        }
      })
  );
  //.then(user => console.log('matched user: ', user));
};

const User = mongoose.model('users', userSchema);

module.exports = User;
