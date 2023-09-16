import { Router } from 'express'
import {
  generateRecipe,
  updateRecipe,
  getAllRecipe,
  deleteRecipe,
} from '../controllers/RecipeService'


const recipeRouter = Router()

recipeRouter.get('/', getAllRecipe)
recipeRouter.post('/generate', generateRecipe)
recipeRouter.put('/:id', updateRecipe)
recipeRouter.delete('/:id', deleteRecipe)



export default recipeRouter
