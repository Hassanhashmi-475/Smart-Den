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
exports.getRecentSalary = exports.getMostRecentSalary = exports.getFinanceById = exports.updateFinance = exports.deleteFinance = exports.createFinance = exports.getExpensesOfGivenMonth = exports.getFinanceDocumentsOfGivenMonth = void 0;
const console_1 = require("console");
const Finance_1 = __importDefault(require("../models/Finance"));
function getMostRecentSalary() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mostRecentEntry = yield Finance_1.default.findOne({})
                .sort({ timestamp: -1 })
                .select('salary')
                .lean()
                .exec();
            return (mostRecentEntry === null || mostRecentEntry === void 0 ? void 0 : mostRecentEntry.salary) || null;
        }
        catch (error) {
            console.error('Error retrieving most recent salary:', error);
            return null;
        }
    });
}
exports.getMostRecentSalary = getMostRecentSalary;
function getRecentSalary(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mostRecentEntry = yield Finance_1.default.findOne({})
                .sort({ timestamp: -1 })
                .select('salary')
                .lean()
                .exec();
            res.status(200).json((mostRecentEntry === null || mostRecentEntry === void 0 ? void 0 : mostRecentEntry.salary) || null);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.getRecentSalary = getRecentSalary;
function getFinanceDocumentsOfGivenMonth(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const month = (_a = req.query.month) === null || _a === void 0 ? void 0 : _a.toString();
            const currentDate = new Date();
            const targetMonth = month
                ? new Date(`${currentDate.getFullYear()}-${month}-01`)
                : currentDate;
            const firstDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
            const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59, 999);
            const financeDocuments = yield Finance_1.default.find({
                timestamp: {
                    $gte: firstDayOfMonth,
                    $lt: lastDayOfMonth,
                },
                isDeleted: false,
            }).exec();
            res.status(200).json(financeDocuments);
        }
        catch (error) {
            console.error('Error retrieving finance documents of the given month:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.getFinanceDocumentsOfGivenMonth = getFinanceDocumentsOfGivenMonth;
function getExpensesOfGivenMonth(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, console_1.log)('In expense tracker');
            const month = (_a = req.query.month) === null || _a === void 0 ? void 0 : _a.toString();
            const currentDate = new Date();
            const targetMonth = month
                ? new Date(`${currentDate.getFullYear()}-${month}-01`)
                : currentDate;
            const firstDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
            const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59, 999);
            const financeDocuments = yield Finance_1.default.find({
                timestamp: {
                    $gte: firstDayOfMonth,
                    $lt: lastDayOfMonth,
                },
                isDeleted: false,
            }).exec();
            const totalExpense = financeDocuments
                .filter((doc) => doc.type === 'debit' && typeof doc.amount === 'number')
                .reduce((sum, doc) => sum + doc.amount, 0);
            res.status(200).json({
                financeDocuments,
                totalExpense,
            });
        }
        catch (error) {
            console.error('Error retrieving finance documents and total expense of the given month:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.getExpensesOfGivenMonth = getExpensesOfGivenMonth;
function createFinance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newFinanceData = req.body;
            const recentSalary = yield getMostRecentSalary();
            (0, console_1.log)(recentSalary);
            if (recentSalary === null) {
                // Handle the case where recent salary is not available
                res.status(500).json({ error: 'Could not retrieve recent salary' });
                return;
            }
            if (newFinanceData.type === 'debit') {
                newFinanceData.salary = recentSalary - newFinanceData.amount;
            }
            else if (newFinanceData.type === 'credit') {
                newFinanceData.salary = recentSalary + newFinanceData.amount;
            }
            else {
                res.status(400).json({ error: 'Invalid finance type' });
                return;
            }
            const newFinanceDocument = new Finance_1.default(newFinanceData);
            const savedFinanceDocument = yield newFinanceDocument.save();
            res.status(201).json(savedFinanceDocument);
        }
        catch (error) {
            console.error('Error creating finance document:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.createFinance = createFinance;
function updateFinance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const financeId = req.params.id;
            const updatedFinanceData = req.body;
            let recentSalary = yield getMostRecentSalary();
            if (recentSalary === null) {
                // Handle the case where recent salary is not available
                res.status(500).json({ error: 'Could not retrieve recent salary' });
                return;
            }
            const existingFinanceDocument = yield Finance_1.default.findById(financeId).exec();
            if (!existingFinanceDocument) {
                res.status(404).json({ error: 'Finance document not found' });
                return;
            }
            if (existingFinanceDocument.type === 'debit' &&
                updatedFinanceData.type === 'credit') {
                recentSalary += existingFinanceDocument.amount;
            }
            else if (existingFinanceDocument.type === 'credit' &&
                updatedFinanceData.type === 'debit') {
                recentSalary -= existingFinanceDocument.amount;
            }
            updatedFinanceData.salary = recentSalary;
            const updatedFinanceDocument = yield Finance_1.default.findByIdAndUpdate(financeId, updatedFinanceData, {
                new: true,
            }).exec();
            if (updatedFinanceDocument) {
                res.status(200).json(updatedFinanceDocument);
            }
            else {
                res.status(404).json({ error: 'Finance document not found' });
            }
        }
        catch (error) {
            console.error('Error updating finance document:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.updateFinance = updateFinance;
function deleteFinance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const financeId = req.params.id;
            const deletedFinanceDocument = yield Finance_1.default.findOneAndUpdate({ _id: financeId }, { isDeleted: true }, { new: true }).exec();
            if (deletedFinanceDocument) {
                res.status(200).json(deletedFinanceDocument);
            }
            else {
                res.status(404).json({ error: 'Finance document not found' });
            }
        }
        catch (error) {
            console.error('Error soft deleting finance document:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.deleteFinance = deleteFinance;
function getFinanceById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const financeId = req.params.id;
            const financeDocument = yield Finance_1.default.findById(financeId).exec();
            if (financeDocument) {
                res.status(200).json(financeDocument);
            }
            else {
                res.status(404).json({ error: 'Finance document not found' });
            }
        }
        catch (error) {
            console.error('Error finding finance document:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.getFinanceById = getFinanceById;
//# sourceMappingURL=FinancialService.js.map