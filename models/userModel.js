const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [5, 'Name must contain at least 5 characters'],
    maxLength: [15, 'Name must contain less than 15 characters'],
  },
  email: {
    type: String,
    unique: [true, 'Such an email already exists'],
    required: [true, 'Email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  photo: String,
  password: {
    type: String,
    unique: [true, 'This password is taken'],
    required: [true, 'Password is required'],
    minLength: [5, 'Password must contain at least 5 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      // This works only on CREATE AND SAVE
      validator: function (val) {
        return this.password === val;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt:{
      type:Date
  },
  role: {
    type:String,
    enum:["user","admin", "guide", "lead-guide"],
    default:"user"
  }
});



userSchema.pre("save", async function(next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  
  //Hash password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  //Delete password confirm field
  this.passwordConfirm = undefined;
  next();
})
//  INSTANCE METHODS
userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  userSchema.methods.passwordChangedAfter =  function(
    JWTTimeStamp
  ) {
      if (this.passwordChangedAt) {
        return (
          parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWTTimeStamp
        );
      }
  
return false;     
  };
  
const User = mongoose.model('User', userSchema)

module.exports = User