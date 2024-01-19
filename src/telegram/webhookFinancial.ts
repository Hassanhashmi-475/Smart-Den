import TelegramBot, { Update } from 'node-telegram-bot-api'
import { config } from 'dotenv'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'
import { HumanMessage, SystemMessage } from 'langchain/schema'
import Finance from '../models/Finance'
import { checkTextIntent } from './selectors/promptSelector2'
import { log } from 'console'
import { getMostRecentSalary } from '../controllers/FinancialService'
import express from 'express'

config()

export async function setupFinancialTelegramBot2(
  app: express.Application
): Promise<TelegramBot> {
  const token = process.env.FINANCIAL_BOT_TOKEN

  const bot = new TelegramBot(token, {
    polling: false,
  })

  // Set up Webhook
  const URI = `/webhook/${token}`
  const webhookURL = `${process.env.PROD_URL}${URI}`
  bot.setWebHook(webhookURL)
  
  log()
  app.post(URI, (req, res) => {
    const update: Update = req.body
    log(req.body, ' This is the body setup of webhook')
    bot.processUpdate(update)
    res.sendStatus(200)
  })

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    try {
      const isTextFinancial = await checkTextIntent(text)
      const recentSalary = await getMostRecentSalary()
      log(recentSalary, 'Salary')

      log(isTextFinancial, '  Transaction')
      if (isTextFinancial) {
        const response = await model.call([
          new SystemMessage(
            `   Please analyze the message if it is a credit or debit transaction(or some purchase or bill). 
                  current salary is : ${recentSalary}
                 If it is a credit transaction, add the amount to the current salary  . 
                 If it is a debit transaction, subtract the amount from the current salary and mention the platform name also (online brand name, online shop name etc).
                 Platform can be a name of a bank also in case of 'credit'.
                 Amount will be the amount that is being credit or debited.
                 type is a string and should give output as 'debit' or 'credit'
                Your output should be in the following format:  ${formatInstructions}'.
             `
          ),
          new HumanMessage(text),
        ])

        const output = await parser.parse(response.content)
        console.log(output, '  output<=============>')
        // console.log(output.description, ' descriptiontle output<=============>');

        const finance = new Finance({
          platform: output.platform,
          type: output.type,
          amount: output.amount,
          description: output.description,
          salary: output.salary,
          text: text,
        })
        log(finance, " Last database body result")
        await finance.save()
        bot.sendMessage(chatId, `   ${finance}`)
        log(chatId)
      } else {
        bot.sendMessage(chatId, `Sorry couldn't save this. really sorry `)
      }
    } catch (error) {
      console.error(error)
    }
  })

  // Additional setup for your chat model, parser, etc.
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      type: z.string().refine((val) => typeof val === 'string', {
        message: 'credit or debit',
      }),
      platform: z.string().refine((val) => typeof val === 'string', {
        message: 'Name of the platform',
      }),

      description: z.string().refine((val) => typeof val === 'string', {
        message: 'description of the transaction in 5 words',
      }),
      amount: z.number().refine((val) => typeof val === 'number', {
        message: 'Amount that is credited or debited',
      }),
      salary: z.number().refine((val) => typeof val === 'number', {
        message: 'due date of the upcoming event ',
      }),
    })
  )

  const formatInstructions = parser.getFormatInstructions()

  const model = new ChatOpenAI({
    temperature: 0,
  })

  return bot
}
