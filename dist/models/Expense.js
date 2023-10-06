"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ExpenseSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Category',
        required: false,
    },
    // createdBy: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'User', 
    //   required: false,
    // },
    date: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
});
const Expense = mongoose_1.default.model('Expense', ExpenseSchema);
exports.default = Expense;
//# sourceMappingURL=Expense.js.map