"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = exports.authenticateUser = void 0;
const errors_1 = __importDefault(require("../errors"));
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticateUser = (req, res, next) => {
    const token = req.signedCookies.jwtToken;
    if (!token) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    try {
        const decoded = (0, jwtUtils_1.isJwtTokenValid)(token);
        if (typeof decoded === 'string') {
            throw new errors_1.default.UnauthenticatedError('Authentication invalid');
        }
        req.user = { name: decoded.name, id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
};
exports.authenticateUser = authenticateUser;
const authorizeUser = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new errors_1.default.UnauthenticatedError('Authentication invalid');
        }
        if (!roles.includes(req.user.role)) {
            throw new errors_1.default.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};
exports.authorizeUser = authorizeUser;
