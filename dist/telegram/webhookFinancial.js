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
exports.setupFinancialTelegramBot2 = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const openai_1 = require("langchain/chat_models/openai");
const output_parsers_1 = require("langchain/output_parsers");
const zod_1 = require("zod");
const schema_1 = require("langchain/schema");
const Finance_1 = __importDefault(require("../models/Finance"));
const promptSelector2_1 = require("./selectors/promptSelector2");
const console_1 = require("console");
const FinancialService_1 = require("../controllers/FinancialService");
(0, dotenv_1.config)();
function setupFinancialTelegramBot2(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.FINANCIAL_BOT_TOKEN;
        const bot = new node_telegram_bot_api_1.default(token, {
            polling: false,
        });
        // Set up Webhook
        const URI = `/webhook/${token}`;
        const webhookURL = `${process.env.PROD_URL}${URI}`;
        bot.setWebHook(webhookURL);
        (0, console_1.log)();
        app.post(URI, (req, res) => {
            const update = req.body;
            (0, console_1.log)(req.body, ' This is the body setup of webhook');
            bot.processUpdate(update);
            res.sendStatus(200);
        });
        bot.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
            const chatId = msg.chat.id;
            const text = msg.text;
            try {
                const isTextFinancial = yield (0, promptSelector2_1.checkTextIntent)(text);
                const recentSalary = yield (0, FinancialService_1.getMostRecentSalary)();
                (0, console_1.log)(recentSalary, 'Salary');
                (0, console_1.log)(isTextFinancial, '  Transaction');
                if (isTextFinancial) {
                    const response = yield model.call([
                        new schema_1.SystemMessage(`   Please analyze the message if it is a credit or debit transaction(or some purchase or bill). 
                  current salary is : ${recentSalary}
                 If it is a credit transaction, add the amount to the current salary  . 
                 If it is a debit transaction, subtract the amount from the current salary and mention the platform name also (online brand name, online shop name etc).
                 Platform can be a name of a bank also in case of 'credit'.
                 Amount will be the amount that is being credit or debited.
                 type is a string and should give output as 'debit' or 'credit'
                Your output should be in the following format:  ${formatInstructions}'.
             `),
                        new schema_1.HumanMessage(text),
                    ]);
                    const output = yield parser.parse(response.content);
                    console.log(output, '  output<=============>');
                    // console.log(output.description, ' descriptiontle output<=============>');
                    const finance = new Finance_1.default({
                        platform: output.platform,
                        type: output.type,
                        amount: output.amount,
                        description: output.description,
                        salary: output.salary,
                        text: text,
                    });
                    (0, console_1.log)(finance, " Last database body result");
                    yield finance.save();
                    bot.sendMessage(chatId, `   ${finance}`);
                    (0, console_1.log)(chatId);
                }
                else {
                    bot.sendMessage(chatId, `Sorry couldn't save this. really sorry `);
                }
            }
            catch (error) {
                console.error(error);
            }
        }));
        // Additional setup for your chat model, parser, etc.
        const parser = output_parsers_1.StructuredOutputParser.fromZodSchema(zod_1.z.object({
            type: zod_1.z.string().refine((val) => typeof val === 'string', {
                message: 'credit or debit',
            }),
            platform: zod_1.z.string().refine((val) => typeof val === 'string', {
                message: 'Name of the platform',
            }),
            description: zod_1.z.string().refine((val) => typeof val === 'string', {
                message: 'description of the transaction in 5 words',
            }),
            amount: zod_1.z.number().refine((val) => typeof val === 'number', {
                message: 'Amount that is credited or debited',
            }),
            salary: zod_1.z.number().refine((val) => typeof val === 'number', {
                message: 'due date of the upcoming event ',
            }),
        }));
        const formatInstructions = parser.getFormatInstructions();
        const model = new openai_1.ChatOpenAI({
            temperature: 0,
        });
        return bot;
    });
}
exports.setupFinancialTelegramBot2 = setupFinancialTelegramBot2;
//# sourceMappingURL=webhookFinancial.js.map