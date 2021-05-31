const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Name is required'],
        minLength: [5, 'Name must contain at least 5 characters'],
        maxLength: [15, 'Name must contain less than 15 characters']
    },
    email: {
        type: String,
        unique:[true, 'Such an email already exists'],
        required: [true, 'Email is required'],
        lowercase:true,
        validate: [ validator.isEmail, 'invalid email' ],
    },
    photo: String,
    password: {
        type: String,
        unique: [true, 'This password is taken'],
        required: [true, 'Password is required'],
        minLength:[5,'Password must contain at least 5 characters']

    },
    passwordConfirm: {
        type: String,
       validate:{
           validator: function (val){
               return this.password === val
           },
           message: 'Passwords do not match'
       }

    }
})

const User = mongoose.model('User', userSchema)

module.exports = User