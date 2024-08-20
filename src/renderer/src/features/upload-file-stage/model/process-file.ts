import { read, utils } from "xlsx";
import { z } from "zod";
import { getZodMessasges } from "../../../shared/utils/get-zod-messages";
import { Expense, ExpenseError } from "../type";
import { format } from "date-fns";
import { CostType } from "../../../providers/store/api/costTypeAPI";
import { ExpenseStatus } from "../../../providers/store/api/type";
import { Supplier } from "../../../providers/store/api/supplierApi";
import { Project } from "../../../providers/store/api/projectsApi";
import { Currency } from "../../../providers/store/api/currencyApi";
import { UserResponse } from "../../../providers/store/api/plansApi";

// Beggining line to start to read expense
const BeginLine = 3;

// Mapping column to index
type ColumnName =
  | "expenseId"
  | "expenseCode"
  | "date"
  | "term"
  | "department"
  | "expenseName"
  | "costType"
  | "unitPrice"
  | "amount"
  | "total"
  | "currency"
  | "projectName"
  | "supplierName"
  | "pic"
  | "note"
  | "status";

const ColumnNameIndexMappingConfig: Record<ColumnName, number> = {
  expenseId: 0,
  expenseCode: 1,
  date: 2,
  term: 3,
  department: 4,
  expenseName: 5,
  costType: 6,
  unitPrice: 7,
  amount: 8,
  total: 9,
  currency: 10,
  projectName: 11,
  supplierName: 12,
  pic: 13,
  note: 14,
  status: 15,
};

// Date pattern
const datePattern = "dd/MM/yyyy";

// Validation schema
const ExpenseIdSchema = z.number().gt(0);
const ExpenseCodeSchema = z.string();
const ExpenseNameSchema = z.string();
const CostTypeSchema = z.string();
const UnitPriceSchema = z.number().gt(0);
const AmountSchema = z.number().gt(0);
const CurrencyNameSchema = z.string();
const ProjectNameSchema = z.string();
const SupplierNameSchema = z.string();
const PicSchema = z.string();
const StatusCodeSchema = z.string();

export interface Options {
  validateExpenseId?: boolean;
  validateExpenseCode?: boolean;
  validateStatusCode?: boolean;
}

export interface User {
  id: number;
  username: string;
}

export interface Param {
  file: File;
  costTypeList: CostType[];
  expenseStatusList: ExpenseStatus[];
  supplierList: Supplier[];
  projectList: Project[];
  currencyList: Currency[];
  checkListUsernameExist: (usernameList: string[]) => Promise<UserResponse[]>;
  options?: Options;
}

export const processFile = async ({
  file,
  costTypeList,
  expenseStatusList,
  supplierList,
  projectList,
  currencyList,
  checkListUsernameExist,
  options,
}: Param) => {
  // Results and errors
  let expenses: Expense[] = [];
  let errors: ExpenseError[] = [];
  let isError = false;

  // If file is null or undefined, return empty array
  if (!file) {
    return { expenses, errors, isError } as const;
  }

  // Convert list of cost type to map by name
  const costTypeMap = mapCostTypeListByLowercaseName(costTypeList);
  const expenseStatusCodeMap =
    mapExpenseStatusCodeByLowercaseName(expenseStatusList);
  const projectMap = mapProjectListByLowercaseName(projectList);
  const supplierMap = mapSupplierListByLowercaseName(supplierList);
  const currencyMap = mapCurrencyListByLowercaseName(currencyList);

  // Convert to array buffer for xlsx to read
  const buffer = await file?.arrayBuffer();

  // Read to workbook
  const workbook = read(buffer, {
    type: "buffer",
    cellDates: true,
  });

  // Loop through each sheet
  for (let sheetName of workbook.SheetNames) {
    // Only import the sheet that have name "Expense"
    if (sheetName === "Expense") {
      // Get sheet
      const sheet = workbook.Sheets[sheetName];

      // Get rows
      const rows: (Date | string | number | undefined)[][] =
        utils.sheet_to_json(sheet, {
          header: 1,
          blankrows: false,
          dateNF: datePattern, // This dateNF definitely not parse date from string from XLSX file as expected, it was due to by default Excel always use the standard MM/dd/yyyy
        });

      // Loop through each row to read expenses
      for (let index = 0; index < rows.length; index++) {
        // Get row
        const row = rows[index];

        // Any row that have index >= 3 will be mapped to expense
        if (index + 1 >= BeginLine) {
          // Get data from cell
          // const rawDate = row[ColumnNameIndexMappingConfig.date];
          const rawExpenseId = row[ColumnNameIndexMappingConfig.expenseId];
          const rawExpenseCode = row[ColumnNameIndexMappingConfig.expenseCode];
          const rawExpenseName = row[ColumnNameIndexMappingConfig.expenseName];
          const rawCostType = row[ColumnNameIndexMappingConfig.costType];
          const rawUnitPrice = row[ColumnNameIndexMappingConfig.unitPrice];
          const rawAmount = row[ColumnNameIndexMappingConfig.amount];
          const rawCurrencyName = row[ColumnNameIndexMappingConfig.currency];
          const rawProjectName = row[ColumnNameIndexMappingConfig.projectName];
          const rawSupplierName =
            row[ColumnNameIndexMappingConfig.supplierName];
          const rawPic = row[ColumnNameIndexMappingConfig.pic];
          const note = row[ColumnNameIndexMappingConfig.note];
          const rawStatusCode = row[ColumnNameIndexMappingConfig.status];

          // Validation
          let isLineError = false;
          const expenseError: ExpenseError = {
            // date: { value: "" },
            expenseId: { value: "" },
            costType: { value: "" },
            code: { value: "" },
            name: { value: "" },
            unitPrice: { value: "" },
            amount: { value: "" },
            project: { value: "" },
            supplier: { value: "" },
            pic: { value: "" },
            notes:
              note instanceof Date ? format(note, datePattern) : note || "",
            status: { value: "" },
            currency: { value: "" },
          };

          // -- Date
          // let date: Date = new Date();
          // let dateErrorMessage: string | null | undefined = "";

          // if (typeof rawDate === "string") {
          //   // This means the xlsx library does not parse successfully, by default Excel always use the standard MM/dd/yyyy (eg: 23/12/2002)
          //   try {
          //     date = parse(rawDate, datePattern, new Date());
          //   } catch {
          //     isLineError = true;
          //     expenseError.date.value = rawDate;
          //     expenseError.date.errorMessage = dateErrorMessage;
          //   }
          // } else if (rawDate instanceof Date) {
          //   // This means the xlsx library parse successfully but wrong format (eg: from 05/12/2022 to 12/05/2022)
          //   const dateStr = format(date, datePattern);
          //   try {
          //     date = parse(dateStr, datePattern, new Date());
          //   } catch {
          //     isLineError = true;
          //     expenseError.date.value = dateStr;
          //     expenseError.date.errorMessage = dateErrorMessage;
          //   }
          // } else {
          //   isLineError = true;
          //   expenseError.date.value = rawDate;
          //   expenseError.date.errorMessage = dateErrorMessage;
          // }

          // -- Expense ID
          let expenseId = typeof rawExpenseId === "number" ? rawExpenseId : 0;
          if (options && options.validateExpenseId) {
            const expenseIdErrorMessage = getZodMessasges(
              () => (expenseId = ExpenseIdSchema.parse(rawExpenseId))
            );

            if (expenseIdErrorMessage) {
              isLineError = true;
              expenseError.expenseId.errorMessage = expenseIdErrorMessage;
            }
          }

          // -- Expense code
          let expenseCode =
            typeof rawExpenseCode === "string" ? rawExpenseCode : "";
          if (options && options.validateExpenseCode) {
            const expenseCodeErrorMessage = getZodMessasges(
              () => (expenseCode = ExpenseCodeSchema.parse(rawExpenseCode))
            );

            if (expenseCodeErrorMessage) {
              isLineError = true;
              expenseError.code.errorMessage = expenseCodeErrorMessage;
            }
          }

          // -- Expense name
          let expenseName = "";
          const expenseNameErrorMessage = getZodMessasges(
            () => (expenseName = ExpenseNameSchema.parse(rawExpenseName))
          );

          if (expenseNameErrorMessage) {
            isLineError = true;
            expenseError.name.errorMessage = expenseNameErrorMessage;
          }

          // -- Cost type
          let costTypeName = "";
          const costTypeErrorMessage = getZodMessasges(
            () => (costTypeName = CostTypeSchema.parse(rawCostType))
          );

          if (costTypeErrorMessage) {
            isLineError = true;
            expenseError.costType.errorMessage = costTypeErrorMessage;
          }

          let costType: CostType | null | undefined = undefined;
          if (costTypeName) {
            if (costTypeMap[costTypeName.toLowerCase()]) {
              costType = costTypeMap[costTypeName.toLowerCase()];
            } else {
              isLineError = true;
              expenseError.costType.errorMessage = "Invalid cost type";
            }
          }

          // -- Unit price
          let unitPrice = 0;
          const unitPriceErrorMessage = getZodMessasges(
            () => (unitPrice = UnitPriceSchema.parse(rawUnitPrice))
          );

          if (unitPriceErrorMessage) {
            isLineError = true;
            expenseError.unitPrice.errorMessage = unitPriceErrorMessage;
          }

          // -- Amount
          let amount = 0;
          const amountErrorMessage = getZodMessasges(
            () => (amount = AmountSchema.parse(rawAmount))
          );

          if (amountErrorMessage) {
            isLineError = true;
            expenseError.amount.errorMessage = amountErrorMessage;
          }

          // -- Currency
          let currencyName = "";
          const currencyNameErrorMessage = getZodMessasges(
            () => (currencyName = CurrencyNameSchema.parse(rawCurrencyName))
          );

          if (currencyNameErrorMessage) {
            isLineError = true;

            expenseError.currency.errorMessage = currencyNameErrorMessage;
          }

          let currency: Currency | null | undefined = undefined;
          if (currencyName) {
            if (currencyMap[currencyName.toLowerCase()]) {
              currency = currencyMap[currencyName.toLowerCase()];
            } else {
              isLineError = true;
              expenseError.currency.errorMessage = "Invalid currency";
            }
          }

          // -- Project
          let projectName = "";
          const projectNameErrorMessage = getZodMessasges(
            () => (projectName = ProjectNameSchema.parse(rawProjectName))
          );

          if (projectNameErrorMessage) {
            isLineError = true;

            expenseError.project.errorMessage = projectNameErrorMessage;
          }

          let project: Project | null | undefined = undefined;
          if (projectName) {
            if (projectMap[projectName.toLowerCase()]) {
              project = projectMap[projectName.toLowerCase()];
            } else {
              isLineError = true;
              expenseError.project.errorMessage = "Invalid project";
            }
          }

          // -- Supplier
          let supplierName = "";
          const supplierNameErrorMessage = getZodMessasges(
            () => (supplierName = SupplierNameSchema.parse(rawSupplierName))
          );

          if (supplierNameErrorMessage) {
            isLineError = true;

            expenseError.supplier.errorMessage = supplierNameErrorMessage;
          }

          let supplier: Supplier | null | undefined = undefined;
          if (supplierName) {
            if (supplierMap[supplierName.toLowerCase()]) {
              supplier = supplierMap[supplierName.toLowerCase()];
            } else {
              isLineError = true;
              expenseError.supplier.errorMessage = "Invalid supplier";
            }
          }

          // -- Pic
          let pic = "";
          const picErrorMessage = getZodMessasges(
            () => (pic = PicSchema.parse(rawPic))
          );

          if (picErrorMessage) {
            isLineError = true;

            expenseError.pic.errorMessage = picErrorMessage;
          }

          // -- Status
          let status: ExpenseStatus | null | undefined = undefined;
          if (options && options.validateStatusCode) {
            let statusCode = "";
            const statusCodeErrorMessage = getZodMessasges(
              () => (statusCode = StatusCodeSchema.parse(rawStatusCode))
            );

            if (statusCodeErrorMessage) {
              isLineError = true;
              expenseError.status.errorMessage = statusCodeErrorMessage;
            }

            if (statusCode) {
              if (expenseStatusCodeMap[statusCode.toLowerCase()]) {
                status = expenseStatusCodeMap[statusCode.toLowerCase()];
              } else {
                isLineError = true;
                expenseError.status.errorMessage = "Invalid status code";
              }
            }
          }

          // Add to result
          if (isLineError) {
            isError = isLineError;

            // Fill in error's value
            expenseError.expenseId.value =
              rawExpenseId instanceof Date
                ? format(rawExpenseId, datePattern)
                : rawExpenseId;

            expenseError.code.value =
              rawExpenseCode instanceof Date
                ? format(rawExpenseCode, datePattern)
                : rawExpenseCode;

            expenseError.name.value =
              rawExpenseName instanceof Date
                ? format(rawExpenseName, datePattern)
                : rawExpenseName;

            expenseError.costType.value =
              rawCostType instanceof Date
                ? format(rawCostType, datePattern)
                : rawCostType;

            expenseError.unitPrice.value =
              rawUnitPrice instanceof Date
                ? format(rawUnitPrice, datePattern)
                : rawUnitPrice;

            expenseError.amount.value =
              rawAmount instanceof Date
                ? format(rawAmount, datePattern)
                : rawAmount;

            expenseError.currency.value =
              rawCurrencyName instanceof Date
                ? format(rawCurrencyName, datePattern)
                : rawCurrencyName;

            expenseError.project.value =
              rawProjectName instanceof Date
                ? format(rawProjectName, datePattern)
                : rawProjectName;

            expenseError.supplier.value =
              rawSupplierName instanceof Date
                ? format(rawSupplierName, datePattern)
                : rawSupplierName;

            expenseError.pic.value =
              rawPic instanceof Date ? format(rawPic, datePattern) : rawPic;

            if (options && options.validateStatusCode) {
              expenseError.status.value =
                rawStatusCode instanceof Date
                  ? format(rawStatusCode, datePattern)
                  : rawStatusCode;
            }

            errors.push(expenseError);
          } else {
            if (costType && project && supplier && currency) {
              expenses.push({
                id: expenseId,
                code: expenseCode,
                name: expenseName,
                costType,
                // date,
                unitPrice,
                amount,
                project,
                supplier,
                pic: {
                  userId: 0,
                  username: pic,
                },
                notes: note ? note.toString() : "",
                status,
                currency,
              });
            }
          }
        }
      }
    }
  }

  // Validate username
  const usernameList = expenses.map(({ pic: { username } }) => username);

  const userList = await checkListUsernameExist(usernameList);

  const userMap: Record<string, number> = {};
  for (let user of userList) {
    userMap[user.username] = user.userId;
  }

  for (let expense of expenses) {
    if (!userMap[expense.pic.username]) {
      isError = true;

      errors.push({
        expenseId: {
          value: expense.id,
        },
        code: {
          value: expense.code,
        },
        name: {
          value: expense.name,
        },
        amount: {
          value: expense.amount,
        },
        costType: { value: expense.costType.name },
        currency: { value: expense.currency.name },
        pic: {
          value: expense.pic.username,
          errorMessage: "Username does not exist",
        },
        project: { value: expense.project.name },
        status: { value: expense.status?.name },
        supplier: { value: expense.supplier.name },
        unitPrice: { value: expense.unitPrice },
        notes: expense.notes,
      });
    } else {
      expense.pic.userId = userMap[expense.pic.username];
    }
  }

  return { expenses, errors, isError } as const;
};

const mapCostTypeListByLowercaseName = (
  costTypeList: CostType[]
): Record<string, CostType> => {
  const costTypeMap: Record<string, CostType> = {};

  for (const costType of costTypeList) {
    costTypeMap[costType.name.toLowerCase()] = costType;
  }

  return costTypeMap;
};

const mapProjectListByLowercaseName = (
  projectList: Project[]
): Record<string, Project> => {
  const projectMap: Record<string, Project> = {};

  for (const project of projectList) {
    projectMap[project.name.toLowerCase()] = project;
  }

  return projectMap;
};

const mapSupplierListByLowercaseName = (
  supplierList: Supplier[]
): Record<string, Supplier> => {
  const supplierMap: Record<string, Supplier> = {};

  for (const supplier of supplierList) {
    supplierMap[supplier.name.toLowerCase()] = supplier;
  }

  return supplierMap;
};

const mapCurrencyListByLowercaseName = (
  currencyList: Currency[]
): Record<string, Currency> => {
  const currencyMap: Record<string, Currency> = {};

  for (const currency of currencyList) {
    currencyMap[currency.name.toLowerCase()] = currency;
  }

  return currencyMap;
};

const mapExpenseStatusCodeByLowercaseName = (
  expenseStatusList: ExpenseStatus[]
): Record<string, ExpenseStatus> => {
  const expenseStatusCodeMap: Record<string, ExpenseStatus> = {};

  for (const status of expenseStatusList) {
    expenseStatusCodeMap[status.code.toLowerCase()] = status;
  }

  return expenseStatusCodeMap;
};
