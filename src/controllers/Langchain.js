import { config } from 'dotenv';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from "zod";
import { HumanMessage, SystemMessage } from 'langchain/schema';

config();
const schema =  z.array(
  z.object({
    title: z.string().describe("one main word for that upcoming event"),
    description: z.string().describe("description of the event"),
    
  })
).describe("list of upcoming events");
const validated = schema.parse([
  {
    title: 43434,
    description: "with boss",
  },
])
const parser = StructuredOutputParser.fromZodSchema(
 
 );
 ;

const formatInstructions = parser.getFormatInstructions();
//console.log(formatInstructions);

const model = new ChatOpenAI({
  temperature: 0,
  
});

async function main() {
  try {
    

    //console.log(input);

    const response = await model.call([
      new SystemMessage(` Specify the upcoming events from the data and time of the event? which user have meeting/or anything else or at what time and for what purpose? Make a list. Your output should always be in the following format: ${formatInstructions}`),
      new HumanMessage("I have a meeting with my boss at 10:00 AM on 12th of August. I have to discuss about the upcoming project.")
    ]);
    const output = await parser.parse(response.content);
    console.log(output);
  } catch (error) {
    console.error(error);
  }
}

main();