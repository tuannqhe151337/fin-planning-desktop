import { Variants, motion } from "framer-motion";
import { Pagination } from "../../shared/pagination";
import { NumericFormat } from "react-number-format";
import { Checkbox } from "../../shared/checkbox";
import clsx from "clsx";
import { AFFIX, Expense } from "../../providers/store/api/type";
import { ExpenseTag } from "../../entities/expense-tag";
import { Skeleton } from "../../shared/skeleton";
import { ExpenseCodePreviewer } from "../../entities/expense-code-previewer";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

// const childrenAnimation: Variants = {
//   [AnimationStage.HIDDEN]: {
//     opacity: 0,
//     y: 10,
//   },
//   [AnimationStage.VISIBLE]: {
//     opacity: 1,
//     y: 0,
//   },
// };

const rowAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

interface Props {
  isRowsSelectable?: boolean;
  listSelectedId?: Set<number>;
  onSelectAllClick?: () => any;
  onRowClick?: (expenseId: number) => any;
  expenses?: Expense[];
  isFetching?: boolean;
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TablePlanExpenses: React.FC<Props> = ({
  isRowsSelectable = false,
  listSelectedId,
  onSelectAllClick,
  onRowClick,
  expenses,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  return (
    <div>
      <table className="table-auto w-full sm:mt-3 lg:mt-7 xl:mx-auto">
        <motion.thead
          className="border-b-2 border-primary-100 dark:border-neutral-700/60 text-sm"
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={rowAnimation}
        >
          <tr>
            {isRowsSelectable && !isFetching && (
              <th className="pl-2.5 pr-1 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
                <Checkbox
                  className="ml-1 mt-0.5"
                  onChange={() => {
                    onSelectAllClick && onSelectAllClick();
                  }}
                />
              </th>
            )}
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70 text-left">
              Expenses
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70 text-left">
              Code
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Cost type
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Unit price
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Amount
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Total
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Project name
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Supplier name
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              PiC
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Notes
            </th>
            <th className="px-1 xl:px-3 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
              Status
            </th>
          </tr>
        </motion.thead>
        <motion.tbody
          className="xl:text-sm lg:text-sm md:text-sm sm:text-sm text-neutral-500/90 dark:text-neutral-400/80"
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={staggerChildrenAnimation}
        >
          {expenses &&
            expenses.map((expense, index) => (
              <motion.tr
                key={expense.expenseId}
                className={clsx({
                  "border-b-2 duration-200": true,
                  "cursor-pointer hover:bg-primary-100/70 hover:dark:bg-neutral-800":
                    isRowsSelectable && !isFetching,
                  "border-b-primary-200/50 dark:border-b-primary-900/50 bg-primary-100 dark:bg-primary-950":
                    isRowsSelectable &&
                    listSelectedId &&
                    listSelectedId.has(expense.expenseId),
                  "border-b-transparent":
                    (listSelectedId &&
                      !listSelectedId.has(expense.expenseId)) ||
                    !listSelectedId,
                  "bg-primary-50/70 dark:bg-neutral-800/70":
                    (index % 2 === 1 &&
                      listSelectedId &&
                      !listSelectedId.has(expense.expenseId)) ||
                    (index % 2 === 1 && !listSelectedId),
                })}
                variants={rowAnimation}
                onClick={() => {
                  isRowsSelectable &&
                    !isFetching &&
                    onRowClick &&
                    onRowClick(expense.expenseId);
                }}
              >
                {isRowsSelectable && (
                  <td className="pl-3.5 pr-2 py-3">
                    <Checkbox
                      className="m-auto"
                      checked={
                        listSelectedId && listSelectedId.has(expense.expenseId)
                      }
                    />
                  </td>
                )}
                <td className="px-2 py-3 xl:py-5 lg:w-min sm:w-[100px] font-extrabold text-left">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <> {expense.name}</>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 lg:w-min sm:w-[100px] font-extrabold text-left">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : expense.expenseCode ? (
                    <ExpenseCodePreviewer expenseCode={expense.expenseCode} />
                  ) : (
                    <div className="opacity-40 font-semibold italic select-none">
                      Empty
                    </div>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 lg:w-min sm:w-[100px] font-bold text-center">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <> {expense.costType.name}</>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 xl:w-min font-bold text-right">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <NumericFormat
                      displayType="text"
                      value={expense.unitPrice}
                      decimalScale={2}
                      prefix={
                        expense.currency.affix === AFFIX.PREFIX
                          ? expense.currency.symbol
                          : undefined
                      }
                      suffix={
                        expense.currency.affix === AFFIX.SUFFIX
                          ? expense.currency.symbol
                          : undefined
                      }
                      thousandSeparator
                    />
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 xl:w-min font-bold text-center">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <> {expense.amount}</>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 xl:w-min font-bold text-right">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <NumericFormat
                      displayType="text"
                      value={expense.amount * expense.unitPrice}
                      decimalScale={2}
                      prefix={
                        expense.currency.affix === AFFIX.PREFIX
                          ? expense.currency.symbol
                          : undefined
                      }
                      suffix={
                        expense.currency.affix === AFFIX.SUFFIX
                          ? expense.currency.symbol
                          : undefined
                      }
                      thousandSeparator
                    />
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 xl:w-min font-bold text-center">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <> {expense.project.name}</>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 lg:w-min sm:w-[100px] font-bold text-center">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <> {expense.supplier.name}</>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 xl:w-min font-bold text-center">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <> {expense.pic.name}</>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 lg:w-min sm:w-[100px] text-sm font-bold text-center text-neutral-400 dark:text-neutral-500">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <> {expense.notes}</>
                  )}
                </td>
                <td className="px-2 py-3">
                  {isFetching ? (
                    <Skeleton className="w-[60px]" />
                  ) : (
                    <ExpenseTag
                      className="m-auto"
                      statusCode={expense.status.code}
                    />
                  )}
                </td>
              </motion.tr>
            ))}
        </motion.tbody>
      </table>

      {isDataEmpty && (
        <div className="flex flex-row flex-wrap items-center justify-center w-full min-h-[250px] text-lg font-semibold text-neutral-400 italic">
          No data found.
        </div>
      )}

      {!isDataEmpty && (
        <motion.div
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={animation}
        >
          <Pagination
            className="mt-6"
            page={page}
            totalPage={totalPage || 1}
            onNext={onNext}
            onPageChange={onPageChange}
            onPrevious={onPrevious}
          />
        </motion.div>
      )}
    </div>
  );
};
