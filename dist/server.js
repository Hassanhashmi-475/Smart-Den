"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const webhookFinancial_1 = require("./telegram/webhookFinancial");
const webhookReminder_1 = require("./telegram/webhookReminder");
const PORT = process.env.PORT || 3000;
(0, webhookReminder_1.setupReminderTelegramBot)(app_1.default);
(0, webhookFinancial_1.setupFinancialTelegramBot2)(app_1.default);
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map