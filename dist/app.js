"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const reminderBot_1 = require("./telegram/reminderBot");
const db_1 = __importDefault(require("./config/db"));
const Auth_1 = require("./config/Auth");
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const reminderRoutes_1 = __importDefault(require("./routes/reminderRoutes"));
const financialBot_1 = require("./telegram/financialBot");
const financeRoutes_1 = __importDefault(require("./routes/financeRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
(0, reminderBot_1.setupTelegramBot)();
(0, financialBot_1.setupFinancialTelegramBot)();
app.use('/api/recipe', Auth_1.isAuth, recipeRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/category', categoryRoutes_1.default);
app.use('/api/reminder', reminderRoutes_1.default);
app.use('/api/finance', financeRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map