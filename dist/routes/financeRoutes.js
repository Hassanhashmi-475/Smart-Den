"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FinancialService_1 = require("../controllers/FinancialService");
const financeRouter = (0, express_1.Router)();
financeRouter.get('/', FinancialService_1.getFinanceDocumentsOfGivenMonth);
financeRouter.get('/expense', FinancialService_1.getExpensesOfGivenMonth);
financeRouter.post('/add', FinancialService_1.createFinance);
financeRouter.patch('/delete/:id', FinancialService_1.deleteFinance);
financeRouter.get('/salary', FinancialService_1.getMostRecentSalary);
financeRouter.get('/:id', FinancialService_1.getFinanceById);
financeRouter.patch('/:id', FinancialService_1.updateFinance);
exports.default = financeRouter;
//# sourceMappingURL=financeRoutes.js.map