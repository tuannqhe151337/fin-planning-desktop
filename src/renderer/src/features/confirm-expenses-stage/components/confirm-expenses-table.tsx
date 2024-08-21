import { Variants, motion } from "framer-motion";
import { NumericFormat } from "react-number-format";
import { Pagination } from "../../../shared/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseTag } from "../../../entities/expense-tag";
import { Expense } from "../../upload-file-stage/type";
import clsx from "clsx";
import { TETooltip } from "tw-elements-react";
import { useWindowHeight } from "@renderer/shared/utils/use-window-height";

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

const childrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
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

interface Props {
  expenses?: Expense[];
  hide?: boolean;
  showExpenseIdColumn?: boolean;
  showExpenseCodeColumn?: boolean;
  showStatusColumn?: boolean;
}

export const ConfirmExpensesTable: React.FC<Props> = ({
  expenses,
  hide,
  showExpenseIdColumn = false,
  showExpenseCodeColumn = false,
  showStatusColumn = false,
}) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const renderExpenseCodeValue = useCallback(
    (expenseCode?: string | number) => {
      if (expenseCode) {
        if (expenseCode.toString().length > 8) {
          return (
            <TETooltip className="cursor-default" title={expenseCode}>
              {expenseCode.toString().substring(0, 8)}...
            </TETooltip>
          );
        } else {
          return <>{expenseCode}</>;
        }
      }
    },
    [],
  );

  // UI: small text for large table
  const isSmallText = useMemo(() => {
    return showExpenseIdColumn || showExpenseCodeColumn || showStatusColumn;
  }, [showExpenseIdColumn, showExpenseCodeColumn, showStatusColumn]);

  // Calculate optimal height for table
  const windowHeight = useWindowHeight();

  const tableHeight = useMemo(() => {
    return windowHeight - 420;
  }, [windowHeight]);

  useEffect(() => {
    // Header height: 32px
    // Row height: 56px
    setPageSize(Math.floor((windowHeight - 426 - 32) / 56));
  }, [windowHeight]);

  return (
    <div>
      <div className="min-h-[312px]" style={{ height: tableHeight }}>
        <table className="table-auto sm:mt-3 lg:mt-5 mx-auto">
          <thead className="xl:text-base lg:text-sm md:text-sm sm:text-sm text-neutral-400/70 dark:text-neutral-500">
            <tr>
              {showExpenseIdColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": isSmallText,
                  })}
                >
                  ID
                </th>
              )}
              {showExpenseCodeColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": isSmallText,
                  })}
                >
                  Code
                </th>
              )}
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Expenses
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Cost type
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Unit price (VND)
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Amount
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Total (VND)
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Project name
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Supplier name
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                PiC
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                Notes
              </th>
              {showStatusColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": isSmallText,
                  })}
                >
                  Status
                </th>
              )}
            </tr>
          </thead>
          <motion.tbody
            key={page}
            className="[&>*:nth-child(even)]:bg-primary-50/70 [&>*:nth-child(even)]:dark:bg-neutral-700/50 xl:text-base lg:text-sm md:text-sm sm:text-sm text-neutral-500/80 dark:text-neutral-400/80"
            initial={AnimationStage.HIDDEN}
            animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
            variants={staggerChildrenAnimation}
          >
            {expenses &&
              expenses
                .slice((page - 1) * pageSize, page * pageSize)
                .map((expense, index) => (
                  <motion.tr key={index} variants={rowAnimation}>
                    {showExpenseIdColumn && (
                      <td className="px-4 py-4 lg:w-min sm:w-[100px] font-extrabold text-left">
                        <div
                          className={clsx({
                            "text-sm": isSmallText,
                          })}
                        >
                          {expense.id}
                        </div>
                      </td>
                    )}
                    {showExpenseCodeColumn && (
                      <td className="px-4 py-4 lg:w-min sm:w-[100px] font-extrabold text-left">
                        <div
                          className={clsx({
                            "text-sm": isSmallText,
                          })}
                        >
                          {renderExpenseCodeValue(expense.code)}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-extrabold text-left">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.costType.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-right">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        <NumericFormat
                          displayType="text"
                          value={expense.unitPrice}
                          decimalScale={2}
                          disabled
                          thousandSeparator
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.amount}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-right">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        <NumericFormat
                          displayType="text"
                          value={expense.unitPrice * expense.amount}
                          decimalScale={2}
                          thousandSeparator
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.project.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.supplier.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.pic.username}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-bold text-center text-neutral-400 dark:text-neutral-500">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.notes}
                      </div>
                    </td>
                    {showStatusColumn && (
                      <td>
                        <ExpenseTag
                          className="m-auto"
                          statusCode={expense.status?.code || ""}
                        />
                      </td>
                    )}
                  </motion.tr>
                ))}
          </motion.tbody>
        </table>
      </div>

      <motion.div
        initial={AnimationStage.HIDDEN}
        animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
        variants={childrenAnimation}
        transition={{ delay: 0.4 }}
      >
        <Pagination
          className="mt-3"
          page={page}
          totalPage={Math.ceil(expenses ? expenses.length / pageSize : 1)}
          onNext={() =>
            setPage((prevPage) => {
              if (expenses) {
                if (prevPage + 1 > expenses.length) {
                  return expenses.length;
                } else {
                  return prevPage + 1;
                }
              } else {
                return 1;
              }
            })
          }
          onPageChange={(page) => {
            setPage(page || 1);
          }}
          onPrevious={() =>
            setPage((prevPage) => {
              if (expenses) {
                if (prevPage === 1) {
                  return 1;
                } else {
                  return prevPage - 1;
                }
              } else {
                return 1;
              }
            })
          }
        />
      </motion.div>
    </div>
  );
};
