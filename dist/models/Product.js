"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        maxlength: [1000, 'Description must be less than 1000 characters'],
    },
    image: {
        type: String,
        required: [true, 'Please provide image'],
        default: '/uploads/default.jpeg',
    },
    category: {
        type: String,
        required: [true, 'Please provide category'],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        required: [true, 'Please provide company'],
        enum: {
            values: ['ikea', 'marcos', 'liddy'],
            message: '{VALUE} is not supported',
        },
    },
    colors: {
        type: [String],
        required: [true, 'Please provide colors'],
        default: ['#222'],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: [true, 'Please provide inventory'],
        default: 15,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Product', ProductSchema);
