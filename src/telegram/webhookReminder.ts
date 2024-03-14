import TelegramBot, { Update } from 'node-telegram-bot-api'
import { config } from 'dotenv'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'
import { HumanMessage, SystemMessage } from 'langchain/schema'
import Reminder from '../models/Reminder'
import { checkTextIntent } from './selectors/promptSelector'
import { log } from 'console'
import express from 'express'

config()

export async function setupReminderTelegramBot(
  app: express.Application
): Promise<TelegramBot> {
  const token = process.env.REMINDER_BOT_TOKEN

  const bot = new TelegramBot(token, {
    polling: false,
  })

  // Set up Webhook
  const URI = `/webhook/${token}`
  const webhookURL = `${process.env.PROD_URL}${URI}`

  bot.setWebHook(webhookURL)

  app.post(URI, (req, res) => {
    const update: Update = req.body
    bot.processUpdate(update)
    // log(req.body, '  Body of webhook message')
    res.sendStatus(200)
  })

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text
    console.log(msg, '  <=============>')

    try {
      const isTextEventOrOccasion = await checkTextIntent(text)

      const currentDate = new Date()
      log(isTextEventOrOccasion, '  Event')
      if (isTextEventOrOccasion) {
        const response : any = await model.invoke([
          new SystemMessage(
            `Specify the upcoming event from the data and time of the event? or place Which user has a meeting(any occasion) or anything else and at what time and for what purpose? Make a list. Your output should always be in the following format: ${formatInstructions}

For example, if the user sends a message like 'We will meet after one week', please extract the due date by considering the current date ${currentDate} and adding one week to it. Include this due date in the list of upcoming events along with the event details.

To extract the due date, you can use JavaScript or a similar programming language to calculate it based on the current date.
`
          ),
          new HumanMessage(text),
        ])

        const output = await parser.parse(response.content)
        console.log(output, '  output<=============>')
        console.log(output.description, ' descriptiontle output<=============>')

        const reminder = new Reminder({
          title: output.title,
          description: output.description,
          priority: false,
          sender: `${msg.from.first_name}  ${msg.from.last_name}`,
          group: msg.chat.type === 'group' ? true : false,
          text: text,
          dueDate: output.dueDate,
        })
        await reminder.save()
        bot.sendMessage(
          chatId,
          ` Saved successfully  ${reminder}`
        )
      } else {
        bot.sendMessage(chatId, `can't save this `)
      }
    } catch (error) {
      console.error(error)
    }
  })

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      title: z.string().refine((val) => typeof val === 'string', {
        message: 'one main word for that upcoming event',
      }),
      description: z.string().refine((val) => typeof val === 'string', {
        message: 'description of the event',
      }),
      dueDate: z.string().refine((val) => typeof val === 'string', {
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
