import { log, timeStamp } from "console";
import Finance, { IFinance } from "../models/Finance";
import { Request, Response } from "express";

async function getMostRecentSalary(): Promise<number | null> {
  try {
    const mostRecentEntry: IFinance | null = await Finance.findOne({})
      .sort({ timestamp: -1 })
      .select("salary")
      .lean()
      .exec();

    return mostRecentEntry?.salary || null;
  } catch (error) {
    console.error("Error retrieving most recent salary:", error);
    return null;
  }
}

async function getRecentSalary(req: Request, res: Response): Promise<void> {
  try {
    const mostRecentEntry: IFinance | null = await Finance.findOne({})
      .sort({ timestamp: -1 })
      .select("salary")
      .lean()
      .exec();

    res.status(200).json(mostRecentEntry?.salary || null);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getFinanceDocumentsOfGivenMonth(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const month: string | undefined = req.query.month?.toString();

    const currentDate = new Date();
    const targetMonth = month
      ? new Date(`${currentDate.getFullYear()}-${month}-01`)
      : currentDate;
    const firstDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const financeDocuments: IFinance[] = await Finance.find({
      timestamp: {
        $gte: firstDayOfMonth,
        $lt: lastDayOfMonth,
      },
      isDeleted: false,
    }).exec();

    res.status(200).json(financeDocuments);
  } catch (error) {
    console.error(
      "Error retrieving finance documents of the given month:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getExpensesOfGivenMonth(
  req: Request,
  res: Response
): Promise<void> {
  try {
    log("In expense tracker");
    const month: string | undefined = req.query.month?.toString();

    const currentDate = new Date();
    const targetMonth = month
      ? new Date(`${currentDate.getFullYear()}-${month}-01`)
      : currentDate;
    const firstDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const financeDocuments: IFinance[] = await Finance.find({
      timestamp: {
        $gte: firstDayOfMonth,
        $lt: lastDayOfMonth,
      },
      isDeleted: false,
    }).exec();

    const totalExpense: number = financeDocuments
      .filter((doc) => doc.type === "debit" && typeof doc.amount === "number")
      .reduce((sum, doc) => sum + doc.amount!, 0);

    res.status(200).json({
      // financeDocuments,
      totalExpense,
    });
  } catch (error) {
    console.error(
      "Error retrieving finance documents and total expense of the given month:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createFinance(req: Request, res: Response): Promise<void> {
  try {
    const newFinanceData: IFinance = req.body;

    const recentSalary: number | null = await getMostRecentSalary();

    log(recentSalary);

    if (recentSalary === null) {
      // Handle the case where recent salary is not available
      res.status(500).json({ error: "Could not retrieve recent salary" });
      return;
    }

    if (newFinanceData.type === "debit") {
      newFinanceData.salary = recentSalary - newFinanceData.amount;
    } else if (newFinanceData.type === "credit") {
      newFinanceData.salary = recentSalary + newFinanceData.amount;
    } else {
      res.status(400).json({ error: "Invalid finance type" });
      return;
    }

    const newFinanceDocument = new Finance(newFinanceData);
    const savedFinanceDocument: IFinance = await newFinanceDocument.save();

    res.status(201).json(savedFinanceDocument);
  } catch (error) {
    console.error("Error creating finance document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateFinance(req: Request, res: Response): Promise<void> {
  try {
    const financeId: string = req.params.id;
    const updatedFinanceData: IFinance = req.body;

    let recentSalary: number | null = await getMostRecentSalary();

    if (recentSalary === null) {
      // Handle the case where recent salary is not available
      res.status(500).json({ error: "Could not retrieve recent salary" });
      return;
    }

    const existingFinanceDocument: IFinance | null = await Finance.findById(
      financeId
    ).exec();

    if (!existingFinanceDocument) {
      res.status(404).json({ error: "Finance document not found" });
      return;
    }

    if (
      existingFinanceDocument.type === "debit" &&
      updatedFinanceData.type === "credit"
    ) {
      recentSalary += existingFinanceDocument.amount;
    } else if (
      existingFinanceDocument.type === "credit" &&
      updatedFinanceData.type === "debit"
    ) {
      recentSalary -= existingFinanceDocument.amount;
    } else if (
      existingFinanceDocument.type === "debit" &&
      updatedFinanceData.type === "debit" &&
      existingFinanceDocument.amount > updatedFinanceData.amount
    ) {
      recentSalary =
        recentSalary +
        (existingFinanceDocument.amount - updatedFinanceData.amount);
    } else if (
      existingFinanceDocument.type === "debit" &&
      updatedFinanceData.type === "debit" &&
      existingFinanceDocument.amount < updatedFinanceData.amount
    ) {
      recentSalary =
        recentSalary -
        (updatedFinanceData.amount - existingFinanceDocument.amount);
    } else if (
      existingFinanceDocument.type === "credit" &&
      updatedFinanceData.type === "credit" &&
      existingFinanceDocument.amount > updatedFinanceData.amount
    ) {
      recentSalary =
        recentSalary -
        (existingFinanceDocument.amount - updatedFinanceData.amount);
    } else if (
      existingFinanceDocument.type === "credit" &&
      updatedFinanceData.type === "credit" &&
      existingFinanceDocument.amount < updatedFinanceData.amount
    ) {
      recentSalary =
        recentSalary +
        (updatedFinanceData.amount - existingFinanceDocument.amount);
    }

    updatedFinanceData.salary = recentSalary;

    const updatedFinanceDocument: IFinance | null =
      await Finance.findByIdAndUpdate(financeId, updatedFinanceData, {
        new: true,
      }).exec();

    if (updatedFinanceDocument) {
      res.status(200).json(updatedFinanceDocument);
    } else {
      res.status(404).json({ error: "Finance document not found" });
    }
  } catch (error) {
    console.error("Error updating finance document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteFinance(req: Request, res: Response): Promise<void> {
  try {
    const financeId: string = req.params.id;

    const deletedFinanceDocument: IFinance | null =
      await Finance.findOneAndUpdate(
        { _id: financeId },
        { isDeleted: true },
        { new: true }
      ).exec();

    if (deletedFinanceDocument) {
      res.status(200).json(deletedFinanceDocument);
    } else {
      res.status(404).json({ error: "Finance document not found" });
    }
  } catch (error) {
    console.error("Error soft deleting finance document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getFinanceById(req: Request, res: Response): Promise<void> {
  try {
    const financeId: string = req.params.id;

    const financeDocument: IFinance | null = await Finance.findById(
      financeId
    ).exec();

    if (financeDocument) {
      res.status(200).json(financeDocument);
    } else {
      res.status(404).json({ error: "Finance document not found" });
    }
  } catch (error) {
    console.error("Error finding finance document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getFinanceData(req: Request, res: Response): Promise<void> {
  try {
    const { type } = req.query;

    if (!type || (type !== "income" && type !== "expense")) {
      res.status(400).json({ error: "Invalid type parameter" });
      return;
    }

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Aggregation for the last seven days
    const weekAggregationPipeline = [
      { $match: getQuery(today, sevenDaysAgo, type) },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          timestamp: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          totalAmount: 1,
          _id: 0,
        },
      },
    ];

    const financeDataWeek: { totalAmount: number; timestamp: Date }[] =
      await Finance.aggregate(weekAggregationPipeline);

    // Generate an array of dates from today to 7 days ago
    const dateRange = generateDateRange(today, sevenDaysAgo);

    const weekResult: { totalAmount: number; timestamp: Date }[] =
      fillMissingDates(financeDataWeek, dateRange);

    // Aggregation for the last four months
    const fourMonthsAgo = new Date(today);
    fourMonthsAgo.setMonth(today.getMonth() - 4);
    fourMonthsAgo.setDate(1); // Set to the start of the month

    console.log("fourMonthsAgo: ", fourMonthsAgo);
    const fourMonthsAggregationPipeline = [
      { $match: getQuery(today, fourMonthsAgo, type) },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          timestamp: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
            },
          },
          totalAmount: 1,
          _id: 0,
        },
      },
    ];

    const financeDataFourMonths: { totalAmount: number; timestamp: Date }[] =
      await Finance.aggregate(fourMonthsAggregationPipeline);

    // Generate an array of months for the last four months
    const monthRange = generateMonthRange(today, fourMonthsAgo);

    console.log("correct Month Range in Main function: ", monthRange);
    console.log("financeDataFourMonths : ", financeDataFourMonths);

    const fourMonthsResult: { totalAmount: number; timestamp: Date }[] =
      fillMissingMonths(financeDataFourMonths, monthRange);

    weekResult.pop();
    fourMonthsResult.pop();

    res
      .status(200)
      .json({ week: weekResult, fourMonthsExpense: fourMonthsResult });
  } catch (error) {
    console.error("Error retrieving finance data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to generate a date range from start to end
function generateDateRange(endDate: Date, startDate: Date): Date[] {
  const dateRange = [];
  let currentDate = new Date(endDate);
  while (currentDate >= startDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return dateRange.reverse();
}

// Function to fill missing dates with totalAmount: 0
function fillMissingDates(
  data: { totalAmount: number; timestamp: Date }[],
  dateRange: Date[]
): {
  totalAmount: number;
  timestamp: Date;
}[] {
  const result: { totalAmount: number; timestamp: Date }[] = [];
  for (const date of dateRange) {
    const existingData = data.find((d) => isSameDay(d.timestamp, date));
    if (existingData) {
      result.push(existingData);
    } else {
      result.push({ totalAmount: 0, timestamp: date });
    }
  }
  return result;
}

// Function to generate a month range from start to end
function generateMonthRange(endDate: Date, startDate: Date): Date[] {
  const monthRange = [];
  let currentDate = new Date(endDate);
  while (currentDate >= startDate) {
    monthRange.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    );
    currentDate.setMonth(currentDate.getMonth() - 1);
  }
  return monthRange.reverse();
}

// Function to fill missing months with totalAmount: 0
function fillMissingMonths(
  data: { totalAmount: number; timestamp: Date }[],
  monthRange: Date[]
): {
  totalAmount: number;
  timestamp: Date;
}[] {
  const result: { totalAmount: number; timestamp: Date }[] = [];

  for (const month of monthRange) {
    const existingData = data.find((d) => isSameMonth(d.timestamp, month));
    if (existingData) {
      result.push(existingData);
    } else {
      result.push({ totalAmount: 0, timestamp: month });
    }
  }
  console.log("result in filling missing months: ", result);
  return result;
}

// Function to check if two dates represent the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Function to check if two dates represent the same month
function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

// Function to get the query for aggregation
function getQuery(today: Date, startDate: Date, type: string): any {
  return {
    type: type === "income" ? "credit" : "debit",
    timestamp: {
      $gte: new Date(startDate.setHours(0, 0, 0, 0)),
      $lte: new Date(today.setHours(23, 59, 59, 999)),
    },
  };
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
  getFinanceData,
};
