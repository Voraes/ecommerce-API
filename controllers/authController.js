const User = require('../models/User');
const { attachCookiesToResponse } = require('../utils/jwt');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  //Check if email is already in use
  const isEmailAlreadyInUse = await User.findOne({ email });
  if (isEmailAlreadyInUse) {
    throw new customError.BadRequestError('Email already exists');
  }

  //First User is and Admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  //Create a new user
  const user = await User.create({ email, name, password, role });

  //Attach JWT token to the response cookie
  const payload = { name: user.name, id: user._id, role: user.role };
  attachCookiesToResponse(res, payload);

  res.status(StatusCodes.CREATED).json({ user: payload });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //Check if email and password are provided
  if (!email || !password) {
    throw new customError.BadRequestError('Please provide email and password');
  }

  //Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.UnauthenticatedError('Invalid Credentials');
  }

  //Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError('Invalid Credentials');
  }

  //Attach JWT token to the response cookie
  const payload = { name: user.name, id: user._id, role: user.role };
  attachCookiesToResponse(res, payload);

  res.status(StatusCodes.OK).json({ user: payload });
};

const logout = async (req, res) => {
  // Clear the cookie
  res.cookie('jwtToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'User logged out' });
};

module.exports = {
  register,
  login,
  logout,
};
