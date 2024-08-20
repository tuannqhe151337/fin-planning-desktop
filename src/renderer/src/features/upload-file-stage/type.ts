import { CostType } from "../../providers/store/api/costTypeAPI";
import { Currency } from "../../providers/store/api/currencyApi";
import { UserResponse } from "../../providers/store/api/plansApi";
import { Project } from "../../providers/store/api/projectsApi";
import { Supplier } from "../../providers/store/api/supplierApi";
import { ExpenseStatus } from "../../providers/store/api/type";

export enum FileUploadStage {
  EMPTY = "empty",
  PROCESSING = "processing",
  SUCCESS = "success",
  INVALID_FORMAT_ERROR = "invalid_format_error",
  VALIDATION_ERROR = "validation_err",
}

export interface Expense {
  // date: Date;
  id: number;
  costType: CostType;
  code: string;
  name: string;
  unitPrice: number;
  amount: number;
  project: Project;
  supplier: Supplier;
  pic: UserResponse;
  notes?: string;
  status?: ExpenseStatus;
  currency: Currency;
}

export interface ExpenseFieldError {
  value: string | number | undefined;
  errorMessage?: string | undefined;
}

export interface ExpenseError {
  // date: ExpenseFieldError;
  expenseId: ExpenseFieldError;
  costType: ExpenseFieldError;
  code: ExpenseFieldError;
  name: ExpenseFieldError;
  unitPrice: ExpenseFieldError;
  amount: ExpenseFieldError;
  project: ExpenseFieldError;
  supplier: ExpenseFieldError;
  pic: ExpenseFieldError;
  notes?: string | number | undefined;
  status: ExpenseFieldError;
  currency: ExpenseFieldError;
}
