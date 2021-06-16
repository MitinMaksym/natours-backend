const User = require('../models/userModel')
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken');
const {promisify} = require('util')

const signToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      consfirmPassword: req.body.consfirmPassword,
      passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id)

    res.status(201).send({
        status: 'success',
        token,
        data:{
            user:newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
  const {email,password} = req.body
  if (!email || !password) {
      return next(new AppError('Provide email and password please', 400))
  }
  const user = await User.findOne({email}).select('+password')

  if (!user ||!(await user.correctPassword(password, user.password))) {
      return next(new AppError('Email or password is incorrect'), 401)
  }
  const token = signToken(user._id)

      res.status(200).send({
        status: 'success',
        token,
      });
})

exports.protect = catchAsync(async (req, res, next) => {
    let token
    // Getting token and check if it's there
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    // Validate token
    if (!token) {
      return next(new AppError("You are not logged in. Please log in to get an access",401))
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // Check if user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError("The user belonging to this token does not longer exist", 401))
    }

    // Check if the user changed password after token was generated
   if (currentUser.passwordChangedAfter(decoded.iat)) {
       return next(new AppError("The current user changed a password. Please try to login again", 401))
   }

// GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next()
  })

  exports.restrictTo = (...roles) => (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return next(new AppError("You don't have a permission to perform this action", 403))
      }
      next()
  }
