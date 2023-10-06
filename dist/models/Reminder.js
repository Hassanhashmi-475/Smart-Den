"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReminderSchema = new mongoose_1.default.Schema({
    sender: {
        type: String,
    },
    title: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        unique: true,
    },
    text: {
        type: String,
        unique: true
    },
    priority: {
        type: Boolean,
        default: false,
    },
    group: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: String,
    },
}, {
    timestamps: true,
});
// Create the Reminder model
const Reminder = mongoose_1.default.model('Reminder', ReminderSchema);
exports.default = Reminder;
//# sourceMappingURL=Reminder.js.map