"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: false,
    },
}, {
    timestamps: true,
});
const Category = mongoose_1.default.model('Category', CategorySchema);
exports.default = Category;
//# sourceMappingURL=Category.js.map