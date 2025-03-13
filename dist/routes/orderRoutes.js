"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = require("../middleware/authentication");
const orderController_1 = require("../controllers/orderController");
router
    .route('/')
    .post(authentication_1.authenticateUser, orderController_1.createOrder)
    .get(authentication_1.authenticateUser, (0, authentication_1.authorizeUser)('admin'), orderController_1.getAllOrders);
router.route('/showAllMyOrders').get(authentication_1.authenticateUser, orderController_1.getCurrentUserOrders);
router
    .route('/:id')
    .get(authentication_1.authenticateUser, orderController_1.getSingleOrder)
    .patch(authentication_1.authenticateUser, orderController_1.updateOrder);
exports.default = router;
