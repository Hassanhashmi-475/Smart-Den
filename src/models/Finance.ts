import mongoose, { Document, Schema } from 'mongoose'

export interface IFinance extends Document {
  type: 'credit' | 'debit'
  amount: number
  description?: string
  platform?: string
  salary: number
  text?: string
  timestamp: Date
  isDeleted:boolean
}

const financeSchema = new Schema<IFinance>({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    // required: true,
  },
  text: {
    type: String,
  },
  amount: {
    type: Number,
    // required: true,
  },
  salary: {
    type: Number,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  platform: {
    type: String,
    // required: true,
  },
  isDeleted:
  {
    type : Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const Finance = mongoose.model<IFinance>('Finance', financeSchema)

export default Finance
