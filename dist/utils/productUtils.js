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
exports.getNumOfReviews = exports.getAverageRatingForProduct = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const getAverageRatingForProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({ product: productId });
    let totalSum = 0;
    for (let i = 0; i < reviews.length; i++) {
        totalSum += reviews[i].rating;
    }
    const averageRating = Math.round(totalSum / reviews.length) || 0;
    return averageRating;
});
exports.getAverageRatingForProduct = getAverageRatingForProduct;
const getNumOfReviews = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({ product: productId });
    return reviews.length;
});
exports.getNumOfReviews = getNumOfReviews;
