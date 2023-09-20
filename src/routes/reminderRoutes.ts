import { Router } from 'express'
import {
  deleteReminder,
  getListReminder,
  getMostRecentReminder,
  getSpecificReminder,
  updatePriority,
} from '../controllers/ReminderService'

const reminderRouter = Router()

reminderRouter.get('/', getMostRecentReminder)
reminderRouter.get('/list', getListReminder)
reminderRouter.get('/:id', getSpecificReminder)
reminderRouter.patch('/:id', updatePriority)
reminderRouter.delete('/:id', deleteReminder)

// reminderRouter.post('/generate', generateRecipe)
// reminderRouter.put('/:id', updateRecipe)
// reminderRouter.delete('/:id', deleteRecipe)

export default reminderRouter
