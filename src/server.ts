import app from './app'
import { setupFinancialTelegramBot2 } from './telegram/webhookFinancial'
import { setupReminderTelegramBot } from './telegram/webhookReminder'

const PORT = process.env.PORT || 3000

setupReminderTelegramBot(app)

setupFinancialTelegramBot2(app)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
