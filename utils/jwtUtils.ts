import { sign, verify } from 'jsonwebtoken';
import { Response } from 'express';

interface Payload {
  name: string;
  id: any;
  role: string;
}

export const generateJwtToken = (payload: Payload) => {
  return sign(payload, process.env.JWT_SECRET || 'JWT_SECRET', {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const isJwtTokenValid = (token: string) => {
  return verify(token, process.env.JWT_SECRET || 'JWT_SECRET');
};

export const attachCookiesToResponse = (res: Response, payload: Payload) => {
  const jwtToken = generateJwtToken(payload);

  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie('jwtToken', jwtToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};
