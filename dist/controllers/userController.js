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
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const jwtUtils_1 = require("../utils/jwtUtils");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find({ role: 'user' }).select('-password');
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        throw new errors_1.default.BadRequestError('Please provide id');
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    if (req.user.id === id || req.user.role === 'admin') {
        const user = yield User_1.default.findOne({ _id: id }).select('-password');
        if (!user) {
            throw new errors_1.default.NotFoundError(`No user with id: ${id}`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ user });
    }
    else {
        throw new errors_1.default.UnauthorizedError('Unauthorized to access this route');
    }
});
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new errors_1.default.BadRequestError('Please provide name and email');
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    const user = yield User_1.default.findOneAndUpdate({ _id: req.user.id }, { name, email }, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new errors_1.default.NotFoundError(`No user with id: ${req.user.id}`);
    }
    const payload = { name: user.name, id: user._id, role: user.role };
    (0, jwtUtils_1.attachCookiesToResponse)(res, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: payload });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.default.BadRequestError('Please provide old and new password');
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    const user = yield User_1.default.findOne({ _id: req.user.id });
    if (user === null) {
        throw new errors_1.default.NotFoundError(`No user with id: ${req.user.id}`);
    }
    const isPasswordCorrect = yield user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Password updated successfully' });
});
exports.updateUserPassword = updateUserPassword;
