import { Request, Response } from 'express'
import Category, { ICategory } from '../models/Category'
import mongoose from 'mongoose'

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, description } = req.body

    const createdBy = req.user
      ? new mongoose.Types.ObjectId(req.user._id)
      : undefined

    const category: ICategory = new Category({
      name,
      description,
      createdBy,
    })

    const savedCategory = await category.save()
    res.status(201).json(savedCategory)
  } catch (error: any) {
    console.error('Error creating category:', error.message)
    res.status(500).json({ error: 'Failed to create category' })
  }
}

export async function getAllCategoriesForUser(req: Request, res: Response) {
  try {
    const createdBy = req.user
      ? new mongoose.Types.ObjectId(req.user._id)
      : undefined

    const categories = await Category.find({ createdBy }).populate('createdBy')
    res.status(200).json(categories)
  } catch (error: any) {
    console.error('Error fetching categories:', error.message)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
}

export async function getCategoryByIdForUser(req: Request, res: Response) {
  try {
    const categoryId = req.params.id
    const createdBy = req.user
      ? new mongoose.Types.ObjectId(req.user._id)
      : undefined

    const category = await Category.findOne({ _id: categoryId, createdBy })

    if (!category) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    res.status(200).json(category)
  } catch (error: any) {
    console.error('Error fetching category:', error.message)
    res.status(500).json({ error: 'Failed to retrieve category' })
  }
}

export async function updateCategoryById(req: Request, res: Response) {
  try {
    const categoryId = req.params.id
    const { name, description } = req.body

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true }
    )

    if (!updatedCategory) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    res.status(200).json(updatedCategory)
  } catch (error: any) {
    console.error('Error updating category:', error.message)
    res.status(500).json({ error: 'Failed to update category' })
  }
}

export async function deleteCategoryById(req: Request, res: Response) {
  try {
    const categoryId = req.params.id

    const deletedCategory = await Category.findByIdAndRemove(categoryId)

    if (!deletedCategory) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    res.status(204).send()
  } catch (error: any) {
    console.error('Error deleting category:', error.message)
    res.status(500).json({ error: 'Failed to delete category' })
  }
}
