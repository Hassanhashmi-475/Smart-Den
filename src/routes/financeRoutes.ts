import { Router } from "express";
import {
  createFinance,
  deleteFinance,
  getExpensesOfGivenMonth,
  getFinanceById,
  getFinanceData,
  getFinanceDocumentsOfGivenMonth,
  getRecentSalary,
  updateFinance,
} from "../controllers/FinancialService";

const financeRouter = Router();

financeRouter.get("/", getFinanceDocumentsOfGivenMonth);

financeRouter.get("/data", getFinanceData);

financeRouter.get("/expense", getExpensesOfGivenMonth);

financeRouter.get("/salary", getRecentSalary);

financeRouter.post("/add", createFinance);

financeRouter.patch("/delete/:id", deleteFinance);

financeRouter.get("/:id", getFinanceById);

financeRouter.patch("/:id", updateFinance);

export default financeRouter;
