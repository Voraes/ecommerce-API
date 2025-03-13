"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = require("../middleware/authentication");
const productController_1 = require("../controllers/productController");
const reviewController_1 = require("../controllers/reviewController");
router
    .route('/')
    .post(authentication_1.authenticateUser, (0, authentication_1.authorizeUser)('admin'), productController_1.createProduct)
    .get(productController_1.getAllProducts);
router.post('/uploadImage', authentication_1.authenticateUser, (0, authentication_1.authorizeUser)('admin'), productController_1.uploadImage);
router
    .route('/:id')
    .get(productController_1.getSingleProduct)
    .patch(authentication_1.authenticateUser, (0, authentication_1.authorizeUser)('admin'), productController_1.updateProduct)
    .delete(authentication_1.authenticateUser, (0, authentication_1.authorizeUser)('admin'), productController_1.deleteProduct);
router.get('/:id/reviews', reviewController_1.getSingleProductReviews);
exports.default = router;
