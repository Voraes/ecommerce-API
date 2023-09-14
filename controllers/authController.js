const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const isEmailAlreadyInUse = await User.findOne({ email });

  if (isEmailAlreadyInUse) {
    throw new customError.BadRequestError('Email already exists');
  }

  //First User is and Admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ email, name, password, role });

  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {};

const logout = async (req, res) => {};

module.exports = {
  register,
  login,
  logout,
};
