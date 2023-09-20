import mongoose, { Document, Schema,Types } from 'mongoose'
import { IUser } from './User'


export interface IRecipe extends Document {
  name: string
  ingredients?: string
  directions: string
  user: mongoose.Types.ObjectId | IUser
}

const recipeSchema: Schema<IRecipe> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    ingredients: {
      type: String,
    },
    directions: {
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
)

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema)

export default Recipe
