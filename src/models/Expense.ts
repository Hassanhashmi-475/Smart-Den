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
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category', 
      required: false,
    },
    // createdBy: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'User', 
    //   required: false,
    // },
    date: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema)

export default Expense
