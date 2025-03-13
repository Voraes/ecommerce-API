"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwtUtils_1 = require("../utils/jwtUtils");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    const isEmailAlreadyInUse = yield User_1.default.findOne({ email });
    if (isEmailAlreadyInUse) {
        throw new errors_1.default.BadRequestError('Email already exists');
    }
    const isFirstAccount = (yield User_1.default.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = yield User_1.default.create({ email, name, password, role });
    const payload = { name: user.name, id: user._id, role: user.role };
    (0, jwtUtils_1.attachCookiesToResponse)(res, payload);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: payload });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errors_1.default.BadRequestError('Please provide email and password');
    }
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    const payload = { name: user.name, id: user._id, role: user.role };
    (0, jwtUtils_1.attachCookiesToResponse)(res, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: payload });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('jwtToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'User logged out' });
});
exports.logout = logout;
