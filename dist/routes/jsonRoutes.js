"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiToJson_1 = require("../chatbot/files/apiToJson");
const profileBot_1 = require("../chatbot/profileBot");
const custom_1 = require("../chatbot/custom");
const customTest_1 = require("../chatbot/customTest");
const anthropic_1 = require("../chatbot/anthropic");
const jsonRouter = (0, express_1.Router)();
jsonRouter.post('/rag', customTest_1.loadedDataBot2);
jsonRouter.get('/loadvector', profileBot_1.chatbot);
jsonRouter.post('/testing', custom_1.loadedDataBot);
jsonRouter.post('/runnable', anthropic_1.runnableSequenceBot);
jsonRouter.get('/loadfile', apiToJson_1.getFinance);
exports.default = jsonRouter;
//# sourceMappingURL=jsonRoutes.js.map