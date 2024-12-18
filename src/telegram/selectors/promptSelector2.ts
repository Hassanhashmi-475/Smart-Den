import { config } from 'dotenv'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'
import { HumanMessage, SystemMessage } from 'langchain/schema'

config()

export async function checkTextIntent(text: string): Promise<boolean> {
  try {
    const model = new ChatOpenAI({
      temperature: 0,
    })

    const selector : any = await model.call([
      new SystemMessage(
        `"Check if the text pertains to a finance-related transaction.If the text involves any financial transaction, whether debit, credit, or any finance-related activity, output 'true'; otherwise, output 'false'. The output should be in lowercase."
`
      ),
      new HumanMessage(text),
    ])

    const parser = StructuredOutputParser.fromZodSchema(z.boolean())
    const isEventOrOccasion = parser.parse(selector.content)

    return isEventOrOccasion
  } catch (error) {
    console.error('An error occurred while checking text intent:', error)
    throw new Error('Error checking text intent')
  }

  {
  }
}
