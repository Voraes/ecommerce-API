import { Request, Response } from 'express';
import User from '../models/User';
import { attachCookiesToResponse } from '../utils/jwtUtils';
import { StatusCodes } from 'http-status-codes';
import customError from '../errors';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const isEmailAlreadyInUse = await User.findOne({ email });
  if (isEmailAlreadyInUse) {
    throw new customError.BadRequestError('Email already exists');
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ email, name, password, role });

  const payload = { name: user.name, id: user._id, role: user.role };
  attachCookiesToResponse(res, payload);

  res.status(StatusCodes.CREATED).json({ user: payload });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customError.BadRequestError('Please provide email and password');
  }

  const user: User | null = await User.findOne({ email });
  if (!user) {
    throw new customError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError('Invalid Credentials');
  }

  const payload = { name: user.name, id: user._id, role: user.role };
  attachCookiesToResponse(res, payload);

  res.status(StatusCodes.OK).json({ user: payload });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('jwtToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'User logged out' });
};
