import express from 'express'
import dotenv from 'dotenv'
import { setupTelegramBot } from './telegram/reminderBot'
import connectDB from './config/db'
import { isAuth } from './config/Auth'
import recipeRoutes from './routes/recipeRoutes'
import userRoutes from './routes/userRoutes'
import categoryRoutes from './routes/categoryRoutes'
import reminderRoutes from './routes/reminderRoutes'
import { setupFinancialTelegramBot } from './telegram/financialBot'
import financeRoutes from './routes/financeRoutes'

dotenv.config()

const app = express()

connectDB()

app.use(express.json())
setupTelegramBot()
setupFinancialTelegramBot()

app.use('/api/recipe', isAuth, recipeRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/reminder', reminderRoutes)
app.use('/api/finance', financeRoutes)


export default app
