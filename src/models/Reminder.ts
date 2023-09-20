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
  dueDate?: Date
  tags: string[]
}


const ReminderSchema: Schema<IReminder> = new mongoose.Schema(
  {
    username: {
      type: String,
    },

    sender: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    text: {
      type: String,
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
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Create the Reminder model
const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema)

export default Reminder
