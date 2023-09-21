const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const jwt = require('../utils/jwt');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  console.log(req.user);
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new CustomError.BadRequestError('Please provide id');
  }

  if (req.user.id === id || req.user.role === 'admin') {
    const user = await User.findOne({ _id: id }).select('-password');

    if (!user) {
      throw new CustomError.NotFoundError(`No user with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({ user });
  } else {
    throw new CustomError.UnauthorizedError(
      'Unauthorized to access this route'
    );
  }
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError('Please provide name and email');
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.user.id}`);
  }

  const payload = { name: user.name, id: user._id, role: user.role };
  jwt.attachCookiesToResponse(res, payload);

  res.status(StatusCodes.OK).json({ user: payload });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please provide old and new password'
    );
  }

  const user = await User.findOne({ _id: req.user.id });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password updated successfully' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
