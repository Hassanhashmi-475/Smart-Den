import { Router } from 'express'
import { getFinance } from '../chatbot/files/apiToJson'
import { chatbot } from '../chatbot/profileBot'
import { loadedDataBot } from '../chatbot/custom'
import { loadedDataBot2 } from '../chatbot/customTest'
import { runnableSequenceBot } from '../chatbot/anthropic'


const jsonRouter = Router()

jsonRouter.post('/runnable', runnableSequenceBot)
jsonRouter.post('/rag', loadedDataBot2)
jsonRouter.get('/loadvector', chatbot)
jsonRouter.post('/testing', loadedDataBot)
jsonRouter.get('/loadfile', getFinance)







export default jsonRouter

