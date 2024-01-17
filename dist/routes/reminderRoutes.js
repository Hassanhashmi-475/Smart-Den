"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReminderService_1 = require("../controllers/ReminderService");
const reminderRouter = (0, express_1.Router)();
reminderRouter.get('/', ReminderService_1.getMostRecentReminder);
reminderRouter.get('/list', ReminderService_1.getListReminder);
reminderRouter.post('/add', ReminderService_1.createReminder);
reminderRouter.get('/:id', ReminderService_1.getSpecificReminder);
reminderRouter.patch('/:id', ReminderService_1.updatePriority);
reminderRouter.delete('/:id', ReminderService_1.deleteReminder);
exports.default = reminderRouter;
//# sourceMappingURL=reminderRoutes.js.map