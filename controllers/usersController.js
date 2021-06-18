const User = require('../models/userModel')
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getUsers = (req, res) => {
  res
    .status(500)
    .send({ status: 'error', message: "This route isn't defined yet" });
};
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

exports.deleteUserById = (req, res) => {
  res
    .status(500)
    .send({ status: 'error', message: "This route isn't defined yet" });
};

exports.updateUserById = catchAsync(async (req, res, next) => {
  
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("For updating password please use /updatePassword", 400))
  }
  const filteredObj = filterObj(req.body,"email","name")
  const newUser = await User.findByIdAndUpdate(req.user._id,filteredObj,{new:true,runValidators:true})
  console.log(newUser)

  res.status(200).json({
    status:"success",
    user:newUser
  })
});
