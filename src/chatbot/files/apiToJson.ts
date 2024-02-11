import { log } from "console";
import Finance, { IFinance } from "../../models/Finance";
import Reminder, { IReminder } from "../../models/Reminder";
import { Request, Response } from "express";
import fs from "fs/promises";

export async function getFinance(req: Request, res: Response): Promise<void> {
  try {
    const filePath = "D:/FYP/Smart-Den/src/chatbot/files/finance.txt";

    const financeDocuments: IFinance[] = await Finance.find(
      {},
      "text amount timestamp"
    ).exec();
    const reminderDocuments: IReminder[] = await Reminder.find({}).exec();

    const financeTextData = financeDocuments
      .map((doc) => `${doc.text} of amount ${doc.amount} on ${doc.timestamp} .`)
      .join("\n");
    const reminderTextData = reminderDocuments
      .map(
        (reminder) =>
          ` Sender is ${reminder.sender}. Meeting title : ${reminder.title},Description ${reminder.description}, Text message was ${reminder.text}  .`
      )
      .join("\n");

    const textData = `${financeTextData}\n\nReminder Data:\n${reminderTextData}`;

    await fs.writeFile(filePath, textData, "utf-8");

    console.log(`Data written to ${filePath}`);
    res.status(200).json({ message: "Data written to text file successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
