const User = require('../models/userModel')
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne } = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getUsers = catchAsync(async (req, res) => {
 const users = await User.find()
 res.status(200).json({
  status:'success',
  length:users.length,
  data: {
    users
  }
})
});
exports.createUser = (req, res) => {
  res
    .status(500)
    .send({ status: 'error', message: "This route isn't defined yet" });
};

exports.getUserById = (req, res) => {
  res
    .status(500)
    .send({ status: 'error', message: "This route isn't defined yet" });
};

exports.deleteUser = deleteOne(User)
exports.updateUser = updateOne(User)

exports.updateMe = catchAsync(async (req, res, next) => {
  
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("For updating password please use /updatePassword", 400))
  }
  const filteredObj = filterObj(req.body,"email","name")
  const newUser = await User.findByIdAndUpdate(req.user._id,filteredObj,{new:true,runValidators:true})

  res.status(200).json({
    status: 'success',
    data: { user: newUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
   await User.findByIdAndUpdate(req.user._id,{active:false});
   res.status(204).json({status:'success',data:null})
});
