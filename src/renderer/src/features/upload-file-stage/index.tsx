import { AnimatePresence, Variants, motion } from "framer-motion";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useFileUpload } from "../../shared/hooks/use-file-upload";
import { Button } from "../../shared/button";
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";
import { cn } from "../../shared/utils/cn";
import { ProcessingFileUI } from "./ui/processing-file-ui";
import { EmptyFileUploadUI } from "./ui/empty-file-upload-ui";
import { Expense, ExpenseError, FileUploadStage } from "./type";
import { processFile } from "./model/process-file";
import { useGetAllCostTypeQuery } from "../../providers/store/api/costTypeAPI";
import { ErrorExpensesTable } from "./components/error-expenses-table";
import { useGetAllExpenseStatusQuery } from "../../providers/store/api/statusApi";
import { getFileExtension } from "./util/get-file-extension";
import { useGetAllProjectQuery } from "../../providers/store/api/projectsApi";
import { useGetAllCurrencyQuery } from "../../providers/store/api/currencyApi";
import { useGetAllSupplierQuery } from "../../providers/store/api/supplierApi";
import { useCheckUserExistMutation } from "../../providers/store/api/plansApi";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

const childrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0.2,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

const callToActionAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0.8,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

interface Props {
  hide?: boolean;
  downloadButtonText?: string;
  inputSection?: React.ReactNode;
  dropzoneHeight?: number;
  disableContinueButton?: boolean;
  validateExpenseId?: boolean;
  validateExpenseCode?: boolean;
  validateStatusCode?: boolean;
  hideBackButton?: boolean;
  onDownloadTemplateClick?: Function;
  onPreviousState?: () => any;
  onNextStage?: (expenses: Expense[]) => any;
}

export const UploadFileStage: React.FC<Props> = ({
  hide,
  downloadButtonText = "Download template",
  inputSection,
  dropzoneHeight = 330,
  disableContinueButton,
  validateExpenseId,
  validateExpenseCode,
  validateStatusCode,
  hideBackButton = false,
  onDownloadTemplateClick,
  onPreviousState,
  onNextStage,
}) => {
  // Validation API
  const { data: costTypeListResult } = useGetAllCostTypeQuery();
  const { data: expenseStatusListResult } = useGetAllExpenseStatusQuery();
  const { data: projectListResult } = useGetAllProjectQuery();
  const { data: currencyListResult } = useGetAllCurrencyQuery();
  const { data: supplierListResult } = useGetAllSupplierQuery();
  const [checkuserExist] = useCheckUserExistMutation();

  // UI: file over
  const [isFileOver, setIsFileOver] = useState<boolean>(false);

  // Ref
  let inputFile = useRef<HTMLInputElement>(null);

  // UI: file processing
  const [fileUploadStage, setFileUploadStage] = useState<FileUploadStage>(
    FileUploadStage.EMPTY
  );
  const [fileName, setFileName] = useState<string>();
  const [fileSize, setFileSize] = useState<number>();

  // Expenses read from file
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseErrors, setExpenseErrors] = useState<ExpenseError[]>([]);

  // Auto move to next stage
  useEffect(() => {
    if (fileUploadStage === FileUploadStage.SUCCESS && !disableContinueButton) {
      const timeoutId = setTimeout(() => {
        onNextStage && onNextStage(expenses);
      }, 1250);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [fileUploadStage]);

  // Handling upload file
  const { dragLeaveHandler, dragOverHandler, dropHandler, inputFileHandler } =
    useFileUpload({
      fileDropHandler() {
        setIsFileOver(false);
      },
      fileLeaveHandler() {
        setIsFileOver(false);
      },
      fileOverHandler() {
        setIsFileOver(true);
      },
      fileUploadHandler: async (files) => {
        if (files.length > 0) {
          const file = files[0];

          // UI: set to state for showing
          setFileUploadStage(FileUploadStage.PROCESSING);
          setFileName(file.name);
          setFileSize(file.size);

          // File extension
          const fileExtension = getFileExtension(file.name);
          if (
            fileExtension !== "xlsx" &&
            fileExtension !== "xls" &&
            fileExtension !== "csv"
          ) {
            setFileUploadStage(FileUploadStage.INVALID_FORMAT_ERROR);
            return;
          }

          // Handle file upload logic
          if (
            costTypeListResult?.data &&
            expenseStatusListResult?.data &&
            projectListResult?.data &&
            supplierListResult?.data &&
            currencyListResult?.data
          ) {
            // Validate data
            const { errors, expenses, isError } = await processFile({
              file,
              costTypeList: costTypeListResult.data,
              expenseStatusList: expenseStatusListResult.data,
              projectList: projectListResult.data,
              currencyList: currencyListResult.data,
              supplierList: supplierListResult.data,
              checkListUsernameExist: async (usernameList) => {
                const { data } = await checkuserExist({ usernameList });

                return data?.data || [];
              },
              options: {
                validateExpenseCode,
                validateStatusCode,
                validateExpenseId,
              },
            });

            // Set to state to show table
            setExpenses(expenses);
            setExpenseErrors(errors);

            // UI: show error table or go to next stage
            if (isError) {
              setFileUploadStage(FileUploadStage.VALIDATION_ERROR);
            } else {
              setFileUploadStage(FileUploadStage.SUCCESS);
            }
          }
        }
      },
    });

  return (
    <motion.div
      className={clsx({
        "pt-2": true,
        "md:w-full lg:w-[900px] xl:w-[1000px]":
          fileUploadStage !== FileUploadStage.VALIDATION_ERROR,
        "lg:w-[950px] xl:w-[1200px]":
          fileUploadStage === FileUploadStage.VALIDATION_ERROR,
      })}
      initial={AnimationStage.HIDDEN}
      animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <motion.div variants={childrenAnimation}>{inputSection}</motion.div>

      {/* File dropzone section */}
      <div className="relative" style={{ height: dropzoneHeight + 58 }}>
        <AnimatePresence>
          {fileUploadStage !== FileUploadStage.VALIDATION_ERROR && (
            <motion.div
              className="absolute w-full"
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
              variants={animation}
            >
              {/* Download template button */}
              <motion.div
                className="flex flex-row flex-wrap items-center w-full mt-3"
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
                variants={animation}
              >
                <Button
                  variant="secondary"
                  containerClassName="ml-auto"
                  className="flex flex-row flex-wrap items-center"
                  onClick={() => {
                    onDownloadTemplateClick && onDownloadTemplateClick();
                  }}
                >
                  <BsFillFileEarmarkArrowDownFill className="mr-3 dark:text-primary-600" />
                  <span className="text-sm dark:text-primary-500">
                    {downloadButtonText}
                  </span>
                </Button>
              </motion.div>

              {/* File dropzone */}
              <div
                className={cn({
                  "relative mt-2 gap-16 group border-2 border-dashed rounded-lg duration-200":
                    true,
                  "cursor-pointer bg-primary-50/50 hover:bg-primary-50 hover:border-primary-300 dark:hover:border-primary-600/70 dark:bg-neutral-700/30 dark:border-neutral-600":
                    fileUploadStage === FileUploadStage.EMPTY,
                  "bg-primary-300/30 dark:bg-primary-800/40 border-primary-400 dark:border-primary-800 shadow-inner":
                    fileUploadStage === FileUploadStage.EMPTY && isFileOver,
                  "bg-primary-50 border-primary-300 dark:bg-neutral-700/50 dark:border-neutral-500":
                    fileUploadStage === FileUploadStage.PROCESSING,
                  "bg-green-200/30 dark:bg-green-950/40 border-green-200 dark:border-green-900":
                    fileUploadStage === FileUploadStage.SUCCESS,
                  "bg-red-200/30 dark:bg-red-950/40 border-red-200 dark:border-red-900":
                    fileUploadStage === FileUploadStage.INVALID_FORMAT_ERROR,
                })}
                style={{ height: dropzoneHeight }}
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onClick={() => {
                  inputFile.current && inputFile.current.click();
                }}
              >
                <input
                  key={new Date().toISOString()}
                  ref={inputFile}
                  hidden
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={inputFileHandler}
                  disabled={fileUploadStage !== FileUploadStage.EMPTY}
                />

                <AnimatePresence>
                  {fileUploadStage === FileUploadStage.EMPTY && (
                    <motion.div
                      className="absolute w-full h-full"
                      initial={AnimationStage.HIDDEN}
                      animate={AnimationStage.VISIBLE}
                      exit={AnimationStage.HIDDEN}
                      variants={animation}
                    >
                      <EmptyFileUploadUI />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {fileUploadStage !== FileUploadStage.EMPTY && (
                    <motion.div
                      className="absolute w-full h-full"
                      initial={AnimationStage.HIDDEN}
                      animate={AnimationStage.VISIBLE}
                      exit={AnimationStage.HIDDEN}
                      variants={animation}
                    >
                      <ProcessingFileUI
                        fileUploadStage={fileUploadStage}
                        fileName={fileName}
                        fileSize={fileSize}
                        onCancel={() => {
                          setFileUploadStage(FileUploadStage.EMPTY);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {fileUploadStage === FileUploadStage.VALIDATION_ERROR && (
            <motion.div
              className="absolute w-full"
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
              variants={animation}
            >
              <ErrorExpensesTable
                expenses={expenseErrors}
                showExpenseIdColumn={validateExpenseId}
                showExpenseCodeColumn={validateExpenseCode}
                showStatusColumn={validateStatusCode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <motion.div
        className="flex flex-row flex-wrap items-center gap-5 w-full mt-5"
        variants={callToActionAnimation}
      >
        {!hideBackButton && (
          <Button
            variant="tertiary"
            className="w-[300px]"
            onClick={() => {
              onPreviousState && onPreviousState();
            }}
          >
            Back
          </Button>
        )}

        {fileUploadStage === FileUploadStage.VALIDATION_ERROR ? (
          <Button
            containerClassName="flex-1"
            onClick={() => {
              setFileUploadStage(FileUploadStage.EMPTY);
            }}
          >
            Upload again
          </Button>
        ) : (
          <Button
            disabled={
              fileUploadStage !== FileUploadStage.SUCCESS ||
              disableContinueButton
            }
            containerClassName="flex-1"
            onClick={() => {
              onNextStage && onNextStage(expenses);
            }}
          >
            Continue to confirm expenses
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};
