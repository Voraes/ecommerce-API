const CustomError = require('../errors');
const { isJwtTokenValid } = require('../utils/jwtUtils');

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.jwtToken;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  try {
    const decoded = isJwtTokenValid(token);
    req.user = { name: decoded.name, id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

const authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
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
