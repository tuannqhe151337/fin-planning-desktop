import { Variants, motion } from "framer-motion";
import { Pagination } from "../../shared/pagination";
import { NumericFormat } from "react-number-format";
import clsx from "clsx";
import { Skeleton } from "../../shared/skeleton";
import {
  AFFIX,
  Expense,
  ExpenseStatusCodes,
} from "../../providers/store/api/type";
import { Checkbox } from "../../shared/checkbox";
import { ExpenseTag } from "../../entities/expense-tag";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ExpenseActionContextMenu } from "../../entities/expense-action-context-menu";
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
  onRowClick?: (expenseId: number, index: number) => any;
  onShiftRowClick?: (expenseId: number, index: number) => any;
  expenses?: Expense[];
  isFetching?: boolean;
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onApproveExpensesClick?: (expenseIds: number[]) => any;
  onDenyExpensesClick?: (expenseIds: number[]) => any;
  onEscPress?: () => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TableReportExpenses: React.FC<Props> = ({
  listSelectedId,
  isRowsSelectable,
  onSelectAllClick,
  onRowClick,
  onShiftRowClick,
  expenses,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onApproveExpensesClick,
  onDenyExpensesClick,
  onEscPress,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // Chosen expense
  const [chosenExpense, setChosenExpense] = useState<Expense>();

  // UI: context menu
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuTop, setContextMenuTop] = useState<number>(0);
  const [contextMenuLeft, setContextMenuLeft] = useState<number>(0);

  useEffect(() => {
    const clickHandler = () => {
      setShowContextMenu(false);
    };

    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  }, []);

  useHotkeys(
    "esc",
    () => {
      setShowContextMenu(false);

      if (!showContextMenu) {
        onEscPress && onEscPress();
      }
    },
    { enableOnFormTags: ["input", "INPUT"] }
  );

  // Prevent select on shift + click
  const preventSelect = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  useHotkeys(
    "shift",
    () => {
      document.addEventListener("selectstart", preventSelect);
    },
    { keydown: true }
  );

  useHotkeys(
    "shift",
    () => {
      document.removeEventListener("selectstart", preventSelect);
    },
    { keyup: true }
  );

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
              <th className="pl-2.5 pr-1 lg:py-1 xl:py-3 font-bold text-primary/70">
                <Checkbox
                  className="ml-1 mt-0.5"
                  checked={listSelectedId?.size === expenses?.length}
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
                onClick={(e) => {
                  if (isRowsSelectable) {
                    if (e.shiftKey) {
                      e.currentTarget.onselectstart = (e) => e.preventDefault();
                      onShiftRowClick &&
                        onShiftRowClick(expense.expenseId, index);
                    } else {
                      onRowClick && onRowClick(expense.expenseId, index);
                    }
                  }
                }}
                onContextMenu={(e) => {
                  if (isRowsSelectable) {
                    e.preventDefault();
                    setShowContextMenu(true);
                    setContextMenuLeft(e.pageX);
                    setContextMenuTop(e.pageY);
                    setChosenExpense(expense);
                  }
                }}
              >
                {isRowsSelectable && !isFetching && (
                  <th className="pl-2.5 pr-1 lg:py-1 xl:py-3 font-bold dark:font-bold text-primary/70">
                    <Checkbox
                      className="ml-1 mt-0.5"
                      checked={listSelectedId?.has(expense.expenseId)}
                    />
                  </th>
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
                  ) : expense.expenseCode &&
                    ExpenseStatusCodes.check(expense.status.code) !==
                      "DENIED" ? (
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
                    <Skeleton className="w-[120px]" />
                  ) : (
                    <NumericFormat
                      displayType="text"
                      value={expense.unitPrice}
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
                    <Skeleton className="w-[120px]" />
                  ) : (
                    <NumericFormat
                      displayType="text"
                      value={expense.unitPrice * expense.amount}
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
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <> {expense.project.name}</>
                  )}
                </td>
                <td className="px-2 py-3 xl:py-5 lg:w-min sm:w-[100px] font-bold text-center">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
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
                  <div className="flex flex-row flex-wrap items-center justify-center">
                    {isFetching ? (
                      <Skeleton className="w-[60px]" />
                    ) : (
                      <ExpenseTag statusCode={expense.status.code} />
                    )}
                  </div>
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

      <ExpenseActionContextMenu
        show={showContextMenu}
        top={contextMenuTop}
        left={contextMenuLeft}
        onApproveExpensesClick={() => {
          if (listSelectedId && listSelectedId.size > 0) {
            onApproveExpensesClick &&
              onApproveExpensesClick(Array.from(listSelectedId));
          } else {
            chosenExpense &&
              onApproveExpensesClick &&
              onApproveExpensesClick([chosenExpense.expenseId]);
          }

          setShowContextMenu(false);
        }}
        onDenyExpensesClick={() => {
          if (listSelectedId && listSelectedId.size > 0) {
            onDenyExpensesClick &&
              onDenyExpensesClick(Array.from(listSelectedId));
          } else {
            chosenExpense &&
              onDenyExpensesClick &&
              onDenyExpensesClick([chosenExpense.expenseId]);
          }

          setShowContextMenu(false);
        }}
      />
    </div>
  );
};
