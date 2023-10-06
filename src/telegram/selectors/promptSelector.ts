import { config } from 'dotenv'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'
import { HumanMessage, SystemMessage } from 'langchain/schema'

config()

export async function checkTextIntent(text: string): Promise<boolean> {
  const model = new ChatOpenAI({
    temperature: 0,
  })

  const selector = await model.call([
    new SystemMessage(
      `Check if the text pertains to an event or occasion: Text: ${text}. Give the output in boolean. If text pertains to an event or any type of occasion, then give the output in boolean 'true' else 'false'. Not 'True' or "False.Like in small letters`
    ),
    new HumanMessage(text),
  ])

  
  const parser = StructuredOutputParser.fromZodSchema(z.boolean())
  const isEventOrOccasion = parser.parse(selector.content)


  return isEventOrOccasion
}
