"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = exports.isJwtTokenValid = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateJwtToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET || 'JWT_SECRET', {
        expiresIn: process.env.JWT_LIFETIME,
    });
};
exports.generateJwtToken = generateJwtToken;
const isJwtTokenValid = (token) => {
    return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || 'JWT_SECRET');
};
exports.isJwtTokenValid = isJwtTokenValid;
const attachCookiesToResponse = (res, payload) => {
    const jwtToken = (0, exports.generateJwtToken)(payload);
    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie('jwtToken', jwtToken, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
};
exports.attachCookiesToResponse = attachCookiesToResponse;
