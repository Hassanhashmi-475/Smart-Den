import TelegramBot from 'node-telegram-bot-api'
import { config } from 'dotenv'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'
import { HumanMessage, SystemMessage } from 'langchain/schema'
import Reminder from '../models/Reminder'


config()

export function setupTelegramBot() {
  const token = '6652658908:AAGbJX0AWZQuJI2GNHqGD0V5v8gollzrjCs'
  const bot = new TelegramBot(token, { polling: true })

  bot.on('message', async (msg: any) => {
    const chatId = msg.chat.id
    const text = msg.text
    console.log(msg, '  <=============>')

    try {
      const response = await model.call([
        new SystemMessage(
          `Specify the upcoming events from the data and time of the event? which user have a meeting or anything else or at what time and for what purpose? Make a list. Your output should always be in the following format: ${formatInstructions}`
        ),
        new HumanMessage(text),
      ])

      const output = await parser.parse(response.content)
      console.log(output.title, ' title output<=============>')
      console.log(output.description, ' descriptiontle output<=============>')

     
      const reminder = new Reminder({
        username: msg.from.username,
        title: output.title,
        description: output.description,
        priority: false,
        sender: `${msg.from.first_name}  ${msg.from.last_name}`,
        group: msg.chat.type === 'group' ? true : false,
      })
      await reminder.save()

      bot.sendMessage(chatId, 'edge cases saved to database successfully')
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
    })
  )

  const formatInstructions = parser.getFormatInstructions()

  const model = new ChatOpenAI({
    temperature: 0,
  })
}
