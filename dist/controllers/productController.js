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
exports.uploadImage = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAllProducts = exports.createProduct = void 0;
const Product = require('../models/Product').default;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const path_1 = __importDefault(require("path"));
const Review_1 = __importDefault(require("../models/Review"));
const productUtils_1 = require("../utils/productUtils");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, image, category, company, colors, featured, freeShipping, inventory, averateRating, } = req.body;
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    const product = yield Product.create({
        name,
        price,
        description,
        image,
        category,
        company,
        colors,
        featured,
        freeShipping,
        inventory,
        averateRating,
        user: req.user.id,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ product });
});
exports.createProduct = createProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, count: products.length });
});
exports.getAllProducts = getAllProducts;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield Product.findOne({ _id: id });
    if (!product) {
        throw new errors_1.default.NotFoundError(`No product with id: ${id}`);
    }
    const averageRating = yield (0, productUtils_1.getAverageRatingForProduct)(id);
    const numOfReviews = yield (0, productUtils_1.getNumOfReviews)(id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ product, averageRating, numOfReviews });
});
exports.getSingleProduct = getSingleProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, description, image, category, company, colors, featured, freeShipping, inventory, averateRating, } = req.body;
    const product = yield Product.findOneAndUpdate({ _id: id }, {
        name,
        price,
        description,
        image,
        category,
        company,
        colors,
        featured,
        freeShipping,
        inventory,
        averateRating,
    }, { new: true, runValidators: true });
    if (!product) {
        throw new errors_1.default.NotFoundError(`No product with id: ${id}`);
    }
    const averageRating = yield (0, productUtils_1.getAverageRatingForProduct)(id);
    const numOfReviews = yield (0, productUtils_1.getNumOfReviews)(id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ product, averageRating, numOfReviews });
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const toBeDeletedProduct = Product.findOne({ _id: id });
    if (!toBeDeletedProduct) {
        throw new errors_1.default.NotFoundError(`No product with id: ${id}`);
    }
    yield Review_1.default.deleteMany({ product: id });
    yield toBeDeletedProduct.remove();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Product deleted' });
});
exports.deleteProduct = deleteProduct;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        throw new errors_1.default.BadRequestError('No Image Uploaded');
    }
    const productImage = req.files.image;
    if (Array.isArray(productImage)) {
        throw new errors_1.default.BadRequestError('Please only upload one image');
    }
    if (!productImage.mimetype.startsWith('image')) {
        throw new errors_1.default.BadRequestError('Please Upload Image');
    }
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new errors_1.default.BadRequestError('Please Upload image smaller than 1MB');
    }
    const imagePath = path_1.default.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    yield productImage.mv(imagePath);
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ imagePath: `/uploads/${productImage.name}` });
});
exports.uploadImage = uploadImage;
