import { StringUnion } from "../../../type";

export enum LocalStorageItemKey {
  TOKEN = "token",
  REFRESH_TOKEN = "refreshToken",
}

export interface PaginationType {
  page: number;
  totalRecords: number;
  limitRecordsPerPage: number;
  numPages: number;
}

export interface PaginationResponse<T> {
  data: T;
  pagination: PaginationType;
}

export interface ListResponse<T> {
  data: T;
}

export interface ErrorData {
  field: string;
  message: string;
}

export enum Role {
  ADMIN = "admin",
  ACCOUNTANT = "accountant",
  FINANCIAL_STAFF = "financial-staff",
}

export const ExpenseStatusCodes = StringUnion(
  "WAITING_FOR_APPROVAL",
  "APPROVED",
  "DENIED",
);

export type ExpenseStatusCode = typeof ExpenseStatusCodes.type;

export interface Expense {
  expenseId: number;
  expenseCode?: string;
  name: string;
  costType: CostType;
  unitPrice: number;
  amount: number;
  currency: Currency;
  project: Project;
  supplier: Supplier;
  department: Department;
  pic: Pic;
  notes: string;
  status: ExpenseStatus;
  approvedBy: ApprovedBy;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovedBy {
  approvedById?: number;
  name?: string;
}

export interface Department {
  departmentId: number;
  name: string;
}

export interface Currency {
  currencyId: number;
  name: string;
  symbol: string;
  affix: AFFIX;
}

export interface ExpenseStatus {
  statusId: number;
  code: ExpenseStatusCode;
  name: string;
}

export interface CostType {
  costTypeId: number;
  name: string;
}

export interface Project {
  projectId: number;
  name: string;
}

export interface Supplier {
  supplierId: number;
  name: string;
}

export interface Pic {
  picId: number;
  name: string;
}

export enum AFFIX {
  PREFIX = "PREFIX",
  SUFFIX = "SUFFIX",
}
