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
exports.updateOrder = exports.getCurrentUserOrders = exports.getSingleOrder = exports.getAllOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product = require('../models/Product').default;
const errors_1 = __importDefault(require("../errors"));
const http_status_codes_1 = require("http-status-codes");
const fakeStripeAPI = (amount, currency) => __awaiter(void 0, void 0, void 0, function* () {
    const clientSecret = 'someRamdomSecretValue';
    return { clientSecret, amount };
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new errors_1.default.BadRequestError('No cart items provided');
    }
    if (!tax || !shippingFee) {
        throw new errors_1.default.BadRequestError('Please provide tax and shipping fee');
    }
    let orderItems = [];
    let subTotal = 0;
    for (const item of cartItems) {
        const dbProduct = yield Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new errors_1.default.NotFoundError(`No product with id: ${item.product}`);
        }
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        orderItems = [...orderItems, singleOrderItem];
        subTotal += item.amount * price;
    }
    const total = tax + shippingFee + subTotal;
    const paymentIntent = yield fakeStripeAPI(total, 'usd');
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    const order = yield Order_1.default.create({
        tax,
        shippingFee,
        cartItems: orderItems,
        subTotal,
        total,
        clientSecret: paymentIntent.clientSecret,
        user: req.user.id,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        order,
        clientSecret: order.clientSecret,
    });
});
exports.createOrder = createOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ orders, count: orders.length });
});
exports.getAllOrders = getAllOrders;
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield Order_1.default.findOne({ _id: id });
    if (!order) {
        throw new errors_1.default.NotFoundError(`No order found with id: ${id}`);
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    if (req.user.id === String(order.user) || req.user.role === 'admin') {
        res.status(http_status_codes_1.StatusCodes.OK).json({ order });
    }
    else {
        throw new errors_1.default.BadRequestError('Not authorized to access this route');
    }
});
exports.getSingleOrder = getSingleOrder;
const getCurrentUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    const orders = yield Order_1.default.find({ user: req.user.id });
    if (!orders) {
        throw new errors_1.default.NotFoundError('No orders found');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ orders, count: orders.length });
});
exports.getCurrentUserOrders = getCurrentUserOrders;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { paymentIntentId } = req.body;
    const order = yield Order_1.default.findOne({ _id: id });
    if (!order) {
        throw new errors_1.default.NotFoundError(`No order found with id: ${id}`);
    }
    if (!req.user) {
        throw new errors_1.default.UnauthenticatedError('Authentication invalid');
    }
    if (req.user.id === String(order.user) || req.user.role === 'admin') {
        order.paymentIntentId = paymentIntentId;
        order.status = 'paid';
        yield order.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({ order });
    }
    else {
        throw new errors_1.default.BadRequestError('Not authorized to access this route');
    }
});
exports.updateOrder = updateOrder;
