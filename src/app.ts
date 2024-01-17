import express from 'express'
import dotenv from 'dotenv'
import { setupReminderTelegramBot } from './telegram/webhookReminder'
import connectDB from './config/db'
import { isAuth } from './config/Auth'
import recipeRoutes from './routes/recipeRoutes'
import userRoutes from './routes/userRoutes'
import categoryRoutes from './routes/categoryRoutes'
import reminderRoutes from './routes/reminderRoutes'
import financeRoutes from './routes/financeRoutes'
import { setupFinancialTelegramBot2 } from './telegram/webhookFinancial'

dotenv.config()

const app = express()

connectDB()

app.use(express.json())

setupReminderTelegramBot(app)

setupFinancialTelegramBot2(app)

app.use('/api/recipe', isAuth, recipeRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/reminder', reminderRoutes)
app.use('/api/finance', financeRoutes)

export default app
