const jwt = require('jsonwebtoken');

// Generate JWT
const generateJwtToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Check if JWT is valid
const isJwtTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Attach JWT to the response cookie
const attachCookiesToResponse = (res, payload) => {
  const jwtToken = generateJwtToken({ payload });

  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie('jwtToken', jwtToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

module.exports = {
  generateJwtToken,
  isJwtTokenValid,
  attachCookiesToResponse,
};
