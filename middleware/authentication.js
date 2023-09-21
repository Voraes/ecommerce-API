const CustomError = require('../errors');
const jwt = require('../utils/jwt');

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.jwtToken;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  try {
    const decoded = jwt.isJwtTokenValid(token);
    req.user = { name: decoded.name, id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

const authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeUser,
};
