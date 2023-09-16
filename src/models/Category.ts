import { IUser } from './User';
import mongoose, { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
  name: string
  description?: string
  createdBy: mongoose.Types.ObjectId  | IUser 
}

const CategorySchema: Schema<ICategory> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Category = mongoose.model<ICategory>('Category', CategorySchema)

export default Category
