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
exports.getFinance = void 0;
const Finance_1 = __importDefault(require("../../models/Finance"));
const Reminder_1 = __importDefault(require("../../models/Reminder"));
const promises_1 = __importDefault(require("fs/promises"));
function getFinance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = "D:/FYP/Smart-Den/src/chatbot/files/finance.txt";
            const financeDocuments = yield Finance_1.default.find({}, "text amount timestamp").exec();
            const reminderDocuments = yield Reminder_1.default.find({}).exec();
            const financeTextData = financeDocuments
                .map((doc) => `${doc.text} of amount ${doc.amount} on ${doc.timestamp} .`)
                .join("\n");
            const reminderTextData = reminderDocuments
                .map((reminder) => ` Sender is ${reminder.sender}. Meeting title : ${reminder.title},Description ${reminder.description}, Text message was ${reminder.text}  .`)
                .join("\n");
            const textData = `${financeTextData}\n\nReminder Data:\n${reminderTextData}`;
            yield promises_1.default.writeFile(filePath, textData, "utf-8");
            console.log(`Data written to ${filePath}`);
            res.status(200).json({ message: "Data written to text file successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.getFinance = getFinance;
//# sourceMappingURL=apiToJson.js.map