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
//Express
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//Import Custom Middlewares and Routers
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
//Other Imports
require('dotenv').config();
require('express-async-errors');
const connect_1 = __importDefault(require("./db/connect"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
//Swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerDocument = yamljs_1.default.load('./swagger.yaml');
app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
//Security Packages
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
//Middleware
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use(express_1.default.static('./public'));
app.use((0, express_fileupload_1.default)());
//Routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/product', productRoutes_1.default);
app.use('/api/v1/review', reviewRoutes_1.default);
app.use('/api/v1/orders', orderRoutes_1.default);
//Error Middleware
app.use(not_found_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)(process.env.MONGO_URL || 'default-mongo-url');
        app.listen(port);
    }
    catch (error) {
        console.log(error);
    }
});
start();
