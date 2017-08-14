const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  id : {type: String},
  name : {type: String, required: true},
  username : {type: String, required: true},
  passwordHash: {type: String}
});

// Encrypt the registered password and store in database
userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

// Authenticate user entered password against stored encrypted passwordhash
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// User login authentication
userSchema.statics.authenticate = function(username, password) {
  return (
    User.findOne({ username: username })
      // Validate entered password against matched username record
      .then(user => {
        if (user && user.validatePassword(password)) {
          console.log('User and Password valid');
          return user;
        } else {
          return null;
        }
      })
  );
};

const User = mongoose.model('users', userSchema);

module.exports = User;
