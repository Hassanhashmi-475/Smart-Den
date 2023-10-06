import mongoose, { Document, Schema } from 'mongoose'

export interface IReminder extends Document {
  username: string
  text: string
  sender: string
  title: string
  description: string
  priority: boolean
  group: boolean
  createdAt: Date
  dueDate?: string
  tags: string[]
}

const ReminderSchema: Schema<IReminder> = new mongoose.Schema(
  {
    sender: {
      type: String,
    },
    title: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      unique: true,
    },
    text: {
      type: String,
      unique:true
    },
    priority: {
      type: Boolean,
      default: false,
    },
    group: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Create the Reminder model
const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema)

export default Reminder
