let mongoose = require('mongoose');
let bcrypt = require('bcrypt');



let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});

//authenticates input against the database

UserSchema.statics.authenticate = function(email, password, callback){
  User.findOne({email: email})
  .exec(function(error, user){
    if(error){
      return callback(error)
    }else if(!user){
      var error = new Error("User is not found");
      error.status = 401;
      return callback(error)
    }

    bcrypt.compare(password, user.password, function(error, result){
      if(result === true){
        return callback(null, user)
      }else{
        return callback();
      }
    })
  })
}

UserSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(error, hash){
    if(error){
      return next(error)
    }
    user.password = hash;
    next();
  })
})



let User = mongoose.model('User', UserSchema);

module.exports = User;
