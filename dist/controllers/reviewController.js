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
exports.getSingleProductReviews = exports.deleteReview = exports.updateReview = exports.getSingleReview = exports.getAllReviews = exports.createReview = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Review_1 = __importDefault(require("../models/Review"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, title, comment, productId } = req.body;
    const isValidProduct = yield Product_1.default.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new errors_1.default.NotFoundError(`No Product with id: ${productId}`);
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    const userAlreadySubmitted = yield Review_1.default.findOne({
        user: req.user.id,
        product: productId,
    });
    if (userAlreadySubmitted) {
        throw new errors_1.default.BadRequestError('Already submitted review for this product');
    }
    const review = yield Review_1.default.create({
        rating,
        title,
        comment,
        user: req.user.id,
        product: isValidProduct,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ rating, title, comment, productId });
});
exports.createReview = createReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({})
        .populate({ path: 'product', select: 'name company price' })
        .populate({ path: 'user', select: 'name' });
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
});
exports.getAllReviews = getAllReviews;
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield Review_1.default.findOne({ _id: id })
        .populate({ path: 'product', select: 'name company price' })
        .populate({ path: 'user', select: 'name' });
    if (!review) {
        throw new errors_1.default.NotFoundError(`No review found with id: ${id}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
});
exports.getSingleReview = getSingleReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const review = yield Review_1.default.findOne({ _id: id });
    if (!review) {
        throw new errors_1.default.NotFoundError(`No review found with id: ${id}`);
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    if (req.user.id === String(review.user) || req.user.role === 'admin') {
        review.rating = rating;
        review.title = title;
        review.comment = comment;
        yield review.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({ review });
    }
    else {
        throw new errors_1.default.BadRequestError('Not authorized to access this route');
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const toBeDeletedReview = yield Review_1.default.findOne({ _id: id });
    if (!toBeDeletedReview) {
        throw new errors_1.default.NotFoundError(`No review found with id: ${id}`);
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    if (req.user.id === String(toBeDeletedReview.user) ||
        req.user.role === 'admin') {
        yield toBeDeletedReview.remove();
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Review Deleted' });
    }
    else {
        throw new errors_1.default.BadRequestError('Not authorized to access this route');
    }
});
exports.deleteReview = deleteReview;
const getSingleProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const reviews = yield Review_1.default.find({ product: id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
});
exports.getSingleProductReviews = getSingleProductReviews;
