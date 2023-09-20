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

module.exports = {
  authenticateUser,
};
