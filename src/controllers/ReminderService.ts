import { Request, Response } from 'express'
import Reminder, { IReminder } from '../models/Reminder'

async function getMostRecentReminder(req: Request, res: Response) {
  try {
    const mostRecentReminder: IReminder | null = await Reminder.findOne(
      {}
    ).sort({ createdAt: -1 })

    if (!mostRecentReminder) {
      return res.status(404).json({ message: 'No reminders found.'})
    }

    res.json(mostRecentReminder)
  } catch (error: any) {
    console.error('Error fetching the most recent reminder:', error.message)
    res.status(500).json({ error: 'Failed to fetch the most recent reminder.' })
  }
}
async function getListReminder(req: Request, res: Response) {
  const { offset, limit } = req.query
  const pages = Number(offset) || 1
  const limits = Number(limit) || 10 // You can set a default limit

  try {
    const totalDoc = await Reminder.countDocuments({}) // Get the total count of reminders

    const getListReminder = await Reminder.find({})
      .sort({ createdAt: -1 })
      .skip((pages - 1) * limits)
      .limit(limits)

    if (!getListReminder || getListReminder.length === 0) {
      return res.status(404).json({ message: 'No reminders found.' })
    }

    res.json({
      reminders: getListReminder,
      pages,
      limits,
      totalDoc,
    })
  } catch (error: any) {
    console.error('Error fetching the reminders:', error.message)
    res.status(500).json({ error: 'Failed to fetch reminders.' })
  }
}


async function getSpecificReminder(req: Request, res: Response) {
  try {
    const getSpecificReminder = await Reminder.find({ _id: req.params.id})

    if (!getSpecificReminder) {
      return res.status(404).json({ message: 'No reminders found.' })
    }

    res.json(getSpecificReminder)
  } catch (error: any) {
    console.error('Error fetching the most recent reminder:', error.message)
    res.status(500).json({ error: 'Failed to fetch the most recent reminder.' })
  }
}


async function updatePriority(req: Request, res: Response) {
  try {
    const updatedReminder: IReminder | null = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body, // Assuming req.body contains the updated data
      { new: true } // This option returns the updated document
    )

    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found.' })
    }

    res.json(updatedReminder)
  } catch (error: any) {
    console.error('Error updating priority:', error.message)
    res.status(500).json({ error: 'Failed to update priority.' })
  }
}


async function deleteReminder(req: Request, res: Response) {
  try {
    const getSpecificReminder = await Reminder.findByIdAndDelete( req.params.id )

    if (!getSpecificReminder) {
      return res.status(404).json({ message: 'No reminders found.' })
    }

    res.json({message: "Reminder marked S deleted"})
  } catch (error: any) {
    console.error('Error fetching the most recent reminder:', error.message)
    res.status(500).json({ error: 'Failed to fetch the most recent reminder.' })
  }
}

export {
  getMostRecentReminder,
  getListReminder,
  getSpecificReminder,
  updatePriority,
  deleteReminder,
}
