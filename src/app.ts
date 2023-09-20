import express from 'express'
import dotenv from 'dotenv'
import { setupTelegramBot } from './telegram/bot'
import connectDB from './config/db'
import { isAuth } from './config/Auth'
import recipeRoutes from './routes/recipeRoutes'
import userRoutes from './routes/userRoutes'
import categoryRoutes from './routes/categoryRoutes'
import reminderRoutes from './routes/reminderRoutes'



dotenv.config()

const app = express()

connectDB()


app.use(express.json())

app.use('/api/recipe',isAuth, recipeRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes )
app.use('/api/reminder', reminderRoutes)

setupTelegramBot()


export default app
