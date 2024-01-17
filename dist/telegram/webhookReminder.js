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
exports.setupReminderTelegramBot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const openai_1 = require("langchain/chat_models/openai");
const output_parsers_1 = require("langchain/output_parsers");
const zod_1 = require("zod");
const schema_1 = require("langchain/schema");
const Reminder_1 = __importDefault(require("../models/Reminder"));
const promptSelector_1 = require("./selectors/promptSelector");
const console_1 = require("console");
(0, dotenv_1.config)();
function setupReminderTelegramBot(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.REMINDER_BOT_TOKEN;
        const bot = new node_telegram_bot_api_1.default(token, {
            polling: false,
        });
        // Set up Webhook
        const URI = `/webhook/${token}`;
        const webhookURL = `${process.env.PROD_URL}${URI}`;
        (0, console_1.log)();
        bot.setWebHook(webhookURL);
        // Express route for handling webhook
        app.post(URI, (req, res) => {
            const update = req.body;
            bot.processUpdate(update);
            res.sendStatus(200);
        });
        bot.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
            const chatId = msg.chat.id;
            const text = msg.text;
            console.log(msg, '  <=============>');
            try {
                const isTextEventOrOccasion = yield (0, promptSelector_1.checkTextIntent)(text);
                const currentDate = new Date();
                (0, console_1.log)(isTextEventOrOccasion, '  Event');
                if (isTextEventOrOccasion) {
                    const response = yield model.call([
                        new schema_1.SystemMessage(`Specify the upcoming event from the data and time of the event? or place Which user has a meeting(any occasion) or anything else and at what time and for what purpose? Make a list. Your output should always be in the following format: ${formatInstructions}

For example, if the user sends a message like 'We will meet after one week', please extract the due date by considering the current date ${currentDate} and adding one week to it. Include this due date in the list of upcoming events along with the event details.

To extract the due date, you can use JavaScript or a similar programming language to calculate it based on the current date.
`),
                        new schema_1.HumanMessage(text),
                    ]);
                    const output = yield parser.parse(response.content);
                    console.log(output, '  output<=============>');
                    console.log(output.description, ' descriptiontle output<=============>');
                    const reminder = new Reminder_1.default({
                        title: output.title,
                        description: output.description,
                        priority: false,
                        sender: `${msg.from.first_name}  ${msg.from.last_name}`,
                        group: msg.chat.type === 'group' ? true : false,
                        text: text,
                        dueDate: output.dueDate,
                    });
                    yield reminder.save();
                    bot.sendMessage(chatId, `Due Date saved to database successfully  ${reminder}`);
                }
                else {
                    bot.sendMessage(chatId, `can't save this `);
                }
            }
            catch (error) {
                console.error(error);
            }
        }));
        const parser = output_parsers_1.StructuredOutputParser.fromZodSchema(zod_1.z.object({
            title: zod_1.z.string().refine((val) => typeof val === 'string', {
                message: 'one main word for that upcoming event',
            }),
            description: zod_1.z.string().refine((val) => typeof val === 'string', {
                message: 'description of the event',
            }),
            dueDate: zod_1.z.string().refine((val) => typeof val === 'string', {
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
exports.setupReminderTelegramBot = setupReminderTelegramBot;
//# sourceMappingURL=webhookReminder.js.map