import { log } from 'console'
import Finance, { IFinance } from '../models/Finance'
import { Request, Response } from 'express'

async function getMostRecentSalary(): Promise<number | null> {
  try {
    const mostRecentEntry: IFinance | null = await Finance.findOne({})
      .sort({ timestamp: -1 })
      .select('salary')
      .lean()
      .exec()

    return mostRecentEntry?.salary || null
  } catch (error) {
    console.error('Error retrieving most recent salary:', error)
    return null
  }
}

async function getRecentSalary(req: Request, res: Response): Promise<void> {
  try {
    log('time')
    const mostRecentEntry: IFinance | null = await Finance.findOne({})
      .sort({ timestamp: -1 })
      .select('salary')
      .lean()

    log('time')
    log(mostRecentEntry.salary)

    res.status(200).json(mostRecentEntry?.salary || null)
  } catch (error) {
    console.error('Error retrieving most recent salary:', error)
    return null
  }
}

async function getFinanceDocumentsOfGivenMonth(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const month: string | undefined = req.query.month?.toString()

    const currentDate = new Date()
    const targetMonth = month
      ? new Date(`${currentDate.getFullYear()}-${month}-01`)
      : currentDate
    const firstDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      1
    )
    const lastDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    const financeDocuments: IFinance[] = await Finance.find({
      timestamp: {
        $gte: firstDayOfMonth,
        $lt: lastDayOfMonth,
      },
      isDeleted: false,
    }).exec()

    res.status(200).json(financeDocuments)
  } catch (error) {
    console.error(
      'Error retrieving finance documents of the given month:',
      error
    )
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function getExpensesOfGivenMonth(
  req: Request,
  res: Response
): Promise<void> {
  try {
    log('In expense tracker')
    const month: string | undefined = req.query.month?.toString()

    const currentDate = new Date()
    const targetMonth = month
      ? new Date(`${currentDate.getFullYear()}-${month}-01`)
      : currentDate
    const firstDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      1
    )
    const lastDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    const financeDocuments: IFinance[] = await Finance.find({
      timestamp: {
        $gte: firstDayOfMonth,
        $lt: lastDayOfMonth,
      },
      isDeleted: false,
    }).exec()

    const totalExpense: number = financeDocuments
      .filter((doc) => doc.type === 'debit' && typeof doc.amount === 'number')
      .reduce((sum, doc) => sum + doc.amount!, 0)

    res.status(200).json({
      financeDocuments,
      totalExpense,
    })
  } catch (error) {
    console.error(
      'Error retrieving finance documents and total expense of the given month:',
      error
    )
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function createFinance(req: Request, res: Response): Promise<void> {
  try {
    const newFinanceData: IFinance = req.body

    const recentSalary: number | null = await getMostRecentSalary()

    log(recentSalary)

    if (recentSalary === null) {
      // Handle the case where recent salary is not available
      res.status(500).json({ error: 'Could not retrieve recent salary' })
      return
    }

    if (newFinanceData.type === 'debit') {
      newFinanceData.salary = recentSalary - newFinanceData.amount
    } else if (newFinanceData.type === 'credit') {
      newFinanceData.salary = recentSalary + newFinanceData.amount
    } else {
      res.status(400).json({ error: 'Invalid finance type' })
      return
    }

    const newFinanceDocument = new Finance(newFinanceData)
    const savedFinanceDocument: IFinance = await newFinanceDocument.save()

    res.status(201).json(savedFinanceDocument)
  } catch (error) {
    console.error('Error creating finance document:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function updateFinance(req: Request, res: Response): Promise<void> {
  try {
    const financeId: string = req.params.id
    const updatedFinanceData: IFinance = req.body

    let recentSalary: number | null = await getMostRecentSalary()

    if (recentSalary === null) {
      // Handle the case where recent salary is not available
      res.status(500).json({ error: 'Could not retrieve recent salary' })
      return
    }

    const existingFinanceDocument: IFinance | null = await Finance.findById(
      financeId
    ).exec()

    if (!existingFinanceDocument) {
      res.status(404).json({ error: 'Finance document not found' })
      return
    }

    if (
      existingFinanceDocument.type === 'debit' &&
      updatedFinanceData.type === 'credit'
    ) {
      recentSalary += existingFinanceDocument.amount
    } else if (
      existingFinanceDocument.type === 'credit' &&
      updatedFinanceData.type === 'debit'
    ) {
      recentSalary -= existingFinanceDocument.amount
    }

    updatedFinanceData.salary = recentSalary

    const updatedFinanceDocument: IFinance | null =
      await Finance.findByIdAndUpdate(financeId, updatedFinanceData, {
        new: true,
      }).exec()

    if (updatedFinanceDocument) {
      res.status(200).json(updatedFinanceDocument)
    } else {
      res.status(404).json({ error: 'Finance document not found' })
    }
  } catch (error) {
    console.error('Error updating finance document:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function deleteFinance(req: Request, res: Response): Promise<void> {
  try {
    const financeId: string = req.params.id

    const deletedFinanceDocument: IFinance | null =
      await Finance.findOneAndUpdate(
        { _id: financeId },
        { isDeleted: true },
        { new: true }
      ).exec()

    if (deletedFinanceDocument) {
      res.status(200).json(deletedFinanceDocument)
    } else {
      res.status(404).json({ error: 'Finance document not found' })
    }
  } catch (error) {
    console.error('Error soft deleting finance document:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function getFinanceById(req: Request, res: Response): Promise<void> {
  try {
    const financeId: string = req.params.id

    const financeDocument: IFinance | null = await Finance.findById(
      financeId
    ).exec()

    if (financeDocument) {
      res.status(200).json(financeDocument)
    } else {
      res.status(404).json({ error: 'Finance document not found' })
    }
  } catch (error) {
    console.error('Error finding finance document:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
export {
  getFinanceDocumentsOfGivenMonth,
  getExpensesOfGivenMonth,
  createFinance,
  deleteFinance,
  updateFinance,
  getFinanceById,
  getMostRecentSalary,
  getRecentSalary,
}
