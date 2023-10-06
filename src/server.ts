import app from './app'
import { checkTextIntent } from './telegram/selectors/promptSelector'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
