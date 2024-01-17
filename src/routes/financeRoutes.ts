import { Router } from 'express'
import {
  createFinance,
  deleteFinance,
  getExpensesOfGivenMonth,
  getFinanceById,
  getFinanceDocumentsOfGivenMonth,
  getMostRecentSalary,
  updateFinance,
} from '../controllers/FinancialService'

const financeRouter = Router()

financeRouter.get('/', getFinanceDocumentsOfGivenMonth)

financeRouter.get('/expense', getExpensesOfGivenMonth)

financeRouter.post('/add', createFinance)

financeRouter.patch('/delete/:id', deleteFinance)

financeRouter.get('/salary',getMostRecentSalary)
financeRouter.get('/:id', getFinanceById)

financeRouter.patch('/:id', updateFinance)

export default financeRouter