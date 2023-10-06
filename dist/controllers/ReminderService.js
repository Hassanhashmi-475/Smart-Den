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
exports.deleteReminder = exports.updatePriority = exports.getSpecificReminder = exports.getListReminder = exports.getMostRecentReminder = void 0;
const Reminder_1 = __importDefault(require("../models/Reminder"));
function getMostRecentReminder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mostRecentReminder = yield Reminder_1.default.findOne({}).sort({ createdAt: -1 });
            if (!mostRecentReminder) {
                return res.status(404).json({ message: 'No reminders found.' });
            }
            res.json(mostRecentReminder);
        }
        catch (error) {
            console.error('Error fetching the most recent reminder:', error.message);
            res.status(500).json({ error: 'Failed to fetch the most recent reminder.' });
        }
    });
}
exports.getMostRecentReminder = getMostRecentReminder;
function getListReminder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { offset, limit } = req.query;
        const pages = Number(offset) || 1;
        const limits = Number(limit) || 10; // You can set a default limit
        try {
            const totalDoc = yield Reminder_1.default.countDocuments({}); // Get the total count of reminders
            const getListReminder = yield Reminder_1.default.find({})
                .sort({ createdAt: -1 })
                .skip((pages - 1) * limits)
                .limit(limits);
            if (!getListReminder || getListReminder.length === 0) {
                return res.status(404).json({ message: 'No reminders found.' });
            }
            res.json({
                reminders: getListReminder,
                pages,
                limits,
                totalDoc,
            });
        }
        catch (error) {
            console.error('Error fetching the reminders:', error.message);
            res.status(500).json({ error: 'Failed to fetch reminders.' });
        }
    });
}
exports.getListReminder = getListReminder;
function getSpecificReminder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getSpecificReminder = yield Reminder_1.default.find({ _id: req.params.id });
            if (!getSpecificReminder) {
                return res.status(404).json({ message: 'No reminders found.' });
            }
            res.json(getSpecificReminder);
        }
        catch (error) {
            console.error('Error fetching the most recent reminder:', error.message);
            res.status(500).json({ error: 'Failed to fetch the most recent reminder.' });
        }
    });
}
exports.getSpecificReminder = getSpecificReminder;
function updatePriority(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedReminder = yield Reminder_1.default.findByIdAndUpdate(req.params.id, req.body, // Assuming req.body contains the updated data
            { new: true } // This option returns the updated document
            );
            if (!updatedReminder) {
                return res.status(404).json({ message: 'Reminder not found.' });
            }
            res.json(updatedReminder);
        }
        catch (error) {
            console.error('Error updating priority:', error.message);
            res.status(500).json({ error: 'Failed to update priority.' });
        }
    });
}
exports.updatePriority = updatePriority;
function deleteReminder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getSpecificReminder = yield Reminder_1.default.findByIdAndDelete(req.params.id);
            if (!getSpecificReminder) {
                return res.status(404).json({ message: 'No reminders found.' });
            }
            res.json({ message: "Reminder marked S deleted" });
        }
        catch (error) {
            console.error('Error fetching the most recent reminder:', error.message);
            res.status(500).json({ error: 'Failed to fetch the most recent reminder.' });
        }
    });
}
exports.deleteReminder = deleteReminder;
//# sourceMappingURL=ReminderService.js.map