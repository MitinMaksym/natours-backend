const User = require('../models/userModel')
const AppError = require('../utils/AppError');
const sendMail = require('../utils/email');
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
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

  exports.forgotPassword = catchAsync(async (req, res, next) => {
      // 1) Get user based on POST email
      const user = await User.findOne({email:req.body.email})
      if (!user) {
          return next(new AppError("Such a user was not found", 404))
      }
      // 2) generate a random reset token
      const resetToken = user.createPasswordResetToken()
      await user.save({validateBeforeSave: false})

      // 3) send token to user
      const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`
      const message = `Forgot your password? Submit a PATCH request with your password and confirmPassword to ${resetURL}`
      try {
        await sendMail({
            email:req.body.email,
            message,
            subject: "Your password reset token. Valid for 10 minutes"
        })

        res.status(200).json({
          status: 'success',
          message: 'Email was sent to the user',
        });
      } catch(err) {
          console.log(err)
          user.createPasswordResetToken = undefined
          user.passwordResetExpiresAt = undefined
          return next(new AppError("There was an error sending an email. Try again later", 500))
      }
    }) 

  exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const resetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    // 2) Set a new password if it hasn't expired
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpiresAt = undefined
    await user.save()

    const token = signToken(user._id)

    res.status(200).send({
      status: 'success',
      token
    });

    next();
  }) 
