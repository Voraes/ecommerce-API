"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = require("../middleware/authentication");
const reviewController_1 = require("../controllers/reviewController");
router.route('/').post(authentication_1.authenticateUser, reviewController_1.createReview).get(reviewController_1.getAllReviews);
router
    .route('/:id')
    .get(reviewController_1.getSingleReview)
    .patch(authentication_1.authenticateUser, reviewController_1.updateReview)
    .delete(authentication_1.authenticateUser, reviewController_1.deleteReview);
exports.default = router;
