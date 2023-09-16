import axios from 'axios'
import { Request, Response } from 'express'
import Recipe, { IRecipe } from '../models/Recipe'
import mongoose from 'mongoose'
import User from '../models/User'
import { log } from 'console'



async function generateRecipe(req: Request, res: Response) {
  try {
    const pythonApiUrl = 'http://localhost:5000/generate_recipe'
    const items: string[] = req.body.items

    const response = await axios.post(pythonApiUrl, { texts: items })
    const generatedRecipes: string[] = response.data

    const formattedRecipes = await Promise.all(
      generatedRecipes.map(async (text: string) => {
        const sections = text.split('\n')
        const formattedSections: string[] = []
         let recipeObj: Partial<IRecipe> = {}

        for (const section of sections) {
          const cleanedSection = section.trim()
          let headline: string

          if (cleanedSection.startsWith('title:')) {
            headline = 'TITLE'
            recipeObj.name = cleanedSection.replace(/title:/i, '').trim()
          } else if (cleanedSection.startsWith('ingredients:')) {
            headline = 'INGREDIENTS'
            recipeObj.ingredients = cleanedSection
              .replace(/ingredients:/i, '')
              .trim()
          } else if (cleanedSection.startsWith('directions:')) {
            headline = 'DIRECTIONS'
            recipeObj.directions = cleanedSection
              .replace(/directions:/i, '')
              .trim()
          } else {
            continue
          }
        }
          recipeObj.user = req.user
            ? new mongoose.Types.ObjectId(req.user._id)
            : undefined

        return new Recipe(recipeObj)
      })
    )

    // Save the generated recipes to the database
    const savedRecipes = await Recipe.create(formattedRecipes)

    res.json(savedRecipes)
    console.log('Saved recipes:', savedRecipes)
  } catch (error:any) {
    console.error('Error generating and saving recipes:', error.message)
    res.status(500).json({ error: 'Failed to generate and save recipes.' })
  }
}

async function updateRecipe(req: Request, res: Response) {
  try {
    const recipeId = req.params.id
    const updatedData = req.body
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      updatedData,
      { new: true }
    )

    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found.' })
    }

    res.json(updatedRecipe)
  } catch (error:any) {
    console.error('Error updating recipe:', error.message)
    res.status(500).json({ error: 'Failed to update the recipe.' })
  }
}

async function getAllRecipe(req: Request, res: Response) {
  try {
    const email = req.user?.email
    log(email)
    const user = await User.find({email: email})
     console.log(user)
     
    const recipes = await Recipe.find().populate({path:'user',select:'_id name email'})
    res.json(recipes)
  } catch (error:any) {
    console.error('Error fetching recipes:', error.message)
    res.status(500).json({ error: 'Failed to fetch recipes.' })
  }
}

async function deleteRecipe(req: Request, res: Response) {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id)
    res.json(recipe)
  } catch (error: any) {
    console.error('Error fetching recipes:', error.message)
    res.status(500).json({ error: 'Failed to fetch recipes.' })
  }
}

export { generateRecipe, updateRecipe, getAllRecipe, deleteRecipe }
