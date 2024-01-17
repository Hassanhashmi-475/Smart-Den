import { Router } from 'express'
import {
  createReminder,
  deleteReminder,
  getListReminder,
  getMostRecentReminder,
  getSpecificReminder,
  updatePriority,
} from '../controllers/ReminderService'

const reminderRouter = Router()

reminderRouter.get('/', getMostRecentReminder)
reminderRouter.get('/list', getListReminder)
reminderRouter.post('/add', createReminder)
reminderRouter.get('/:id', getSpecificReminder)
reminderRouter.patch('/:id', updatePriority)
reminderRouter.delete('/:id', deleteReminder)

export default reminderRouter
