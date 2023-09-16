import { Router } from 'express'
import {
  createCategory,
  getAllCategoriesForUser,
  getCategoryByIdForUser,
  updateCategoryById,
  deleteCategoryById,
} from '../controllers/CategoryService'
import { isAuth } from '../config/Auth'

const categoryRouter = Router()

categoryRouter.post('/add', isAuth, createCategory)

categoryRouter.get('/', isAuth, getAllCategoriesForUser)

categoryRouter.get('/:id', isAuth, getCategoryByIdForUser)

categoryRouter.put('/:id', updateCategoryById)

categoryRouter.delete('/:id', deleteCategoryById)

export default categoryRouter
