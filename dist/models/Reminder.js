"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReminderSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
    },
    sender: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    text: {
        type: String,
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
        type: Date,
    },
}, {
    timestamps: true,
});
// Create the Reminder model
const Reminder = mongoose_1.default.model('Reminder', ReminderSchema);
exports.default = Reminder;
//# sourceMappingURL=Reminder.js.map