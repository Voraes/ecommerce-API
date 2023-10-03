import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/authentication';

import User from '../models/User';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';
import { attachCookiesToResponse } from '../utils/jwtUtils';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  save(): Promise<User>;
}

export const getAllUsers = async (req: CustomRequest, res: Response) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw new CustomError.BadRequestError('Please provide id');
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
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

export const showCurrentUser = async (req: CustomRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError('Please provide name and email');
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
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
  attachCookiesToResponse(res, payload);

  res.status(StatusCodes.OK).json({ user: payload });
};

export const updateUserPassword = async (req: CustomRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please provide old and new password'
    );
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  const user: User | null = await User.findOne({ _id: req.user.id });

  if (user === null) {
    throw new CustomError.NotFoundError(`No user with id: ${req.user.id}`);
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password updated successfully' });
};
