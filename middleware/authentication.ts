import { Request, Response, NextFunction } from 'express';

import CustomError from '../errors';
import { isJwtTokenValid } from '../utils/jwtUtils';

export interface CustomRequest extends Request {
  user?: {
    name: string;
    id: string;
    role: string;
  };
}

export const authenticateUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.jwtToken;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  try {
    const decoded = isJwtTokenValid(token);
    if (typeof decoded === 'string') {
      throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
    req.user = { name: decoded.name, id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

export const authorizeUser = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};
