import { ICategory } from './Category';
import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './User';

export interface IExpense extends Document {
  description: string
  amount: number
  category: mongoose.Types.ObjectId | ICategory
  createdBy: mongoose.Types.ObjectId | IUser
  date: Date
}

const ExpenseSchema: Schema<IExpense> = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category', 
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema)

export default Expense
