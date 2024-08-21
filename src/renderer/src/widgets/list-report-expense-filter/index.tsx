import { AnimatePresence, Variants, motion } from "framer-motion";
import { SearchBox } from "../../shared/search-box";
import { IconButton } from "../../shared/icon-button";
import { FaListCheck, FaFilter, FaCheck } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { FaDownload, FaUpload } from "react-icons/fa";
import { useState } from "react";
import { TERipple } from "tw-elements-react";
import { useCloseOutside } from "../../shared/hooks/use-close-popup";
import { CostTypeFilter } from "../../entities/cost-type-filter";
import { Button } from "../../shared/button";
import { RiDeleteRow } from "react-icons/ri";
import { CurrencyChanger } from "../../entities/currency-changer";
import { Currency } from "../../providers/store/api/currencyApi";
import { StatusExpenseFilter } from "@renderer/entities/status-expense-filter";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
};

const childrenAnimation: Variants = {
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

const heightPlaceholderAnimation: Variants = {
  hidden: {
    height: 0,
    transition: {
      delay: 0.5,
    },
  },
  visible: {
    height: 60,
  },
};

const ReviewExpenseWidth = 360;
const widthPlaceholderAnimation: Variants = {
  hidden: {
    height: 0,
    transition: {
      delay: 0.4,
    },
  },
  visible: {
    width: ReviewExpenseWidth,
    transition: {
      duration: 0.4,
    },
  },
};

interface Props {
  className?: string;
  showReviewExpense?: boolean;
  searchboxValue?: string;
  currencyId?: number;
  allowReviewPlan?: boolean;
  onSearchboxChange?: (value: string) => any;
  onCostTypeIdChange?: (costTypeId: number | null | undefined) => any;
  onStatusIdChange?: (statusId: number | null | undefined) => any;
  onCurrencyChoose?: (currency?: Currency) => any;
  onApproveExpensesClick?: () => any;
  onDenyExpensesClick?: () => any;
  onDownloadClick?: () => any;
  onUploadReviewReportClick?: () => any;
  onMarkAsReviewed?: () => any;
}

export const ListReportExpenseFilter: React.FC<Props> = ({
  className,
  showReviewExpense,
  searchboxValue,
  currencyId,
  allowReviewPlan,
  onSearchboxChange,
  onCostTypeIdChange,
  onStatusIdChange,
  onCurrencyChoose,
  onApproveExpensesClick,
  onDenyExpensesClick,
  onDownloadClick,
  onUploadReviewReportClick,
  onMarkAsReviewed,
}) => {
  // Filter section
  const [showFillterBtn, setShowFillterBtn] = useState(false);

  // Show dropdown options
  const [showOptions, setShowOptions] = useState(false);

  const ref = useCloseOutside({
    open: showOptions,
    onClose: () => {
      setShowOptions(false);
    },
  });

  return (
    <div className={className}>
      <motion.div
        className={"flex flex-row flex-wrap items-center gap-2"}
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        variants={staggerChildrenAnimation}
      >
        {/* Search box */}
        <motion.div className="flex-1" variants={childrenAnimation}>
          <SearchBox
            value={searchboxValue}
            onChange={(e) =>
              onSearchboxChange && onSearchboxChange(e.currentTarget.value)
            }
          />
        </motion.div>

        <div className="flex flex-row flex-wrap items-center ml-2">
          {/* Review expenses section */}
          <div className="relative self-start mt-0.5">
            <AnimatePresence>
              {showReviewExpense && (
                <div
                  className="absolute right-0 top-0"
                  style={{ width: ReviewExpenseWidth }}
                >
                  <motion.div
                    className="flex flex-row flex-wrap items-center"
                    initial={AnimationStage.HIDDEN}
                    animate={AnimationStage.VISIBLE}
                    variants={staggerChildrenAnimation}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div variants={childrenAnimation}>
                      <Button
                        variant="error"
                        containerClassName="mr-3"
                        onClick={() => {
                          onDenyExpensesClick && onDenyExpensesClick();
                        }}
                      >
                        <div className="flex flex-row flex-wrap items-center gap-3">
                          <RiDeleteRow className="text-xl" />
                          <p className="text-sm font-semibold">Deny expense</p>
                        </div>
                      </Button>
                    </motion.div>

                    <motion.div variants={childrenAnimation}>
                      <Button
                        containerClassName="mr-3"
                        onClick={() => {
                          onApproveExpensesClick && onApproveExpensesClick();
                        }}
                      >
                        <div className="flex flex-row flex-wrap items-center gap-3">
                          <FaListCheck className="text-lg" />
                          <p className="text-sm font-semibold">
                            Approve expense
                          </p>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <motion.div
              initial={AnimationStage.HIDDEN}
              animate={
                showReviewExpense
                  ? AnimationStage.VISIBLE
                  : AnimationStage.HIDDEN
              }
              variants={widthPlaceholderAnimation}
            />
          </div>

          {/* Currency changer */}
          <motion.div variants={childrenAnimation}>
            <CurrencyChanger
              chosenCurrencyId={currencyId}
              className="-mb-1.5"
              onCurrencyChoose={onCurrencyChoose}
            />
          </motion.div>

          {/* Filter icon */}
          <motion.div variants={childrenAnimation}>
            <IconButton
              tooltip="Filter"
              onClick={() => {
                setShowFillterBtn((prevState) => !prevState);
              }}
            >
              <FaFilter className="text-xl text-primary -mb-0.5 mt-0.5" />
            </IconButton>
          </motion.div>

          {/* Three dots icon */}
          <motion.div variants={childrenAnimation}>
            <div className="relative" ref={ref}>
              <IconButton
                tooltip="More"
                onClick={() => {
                  setShowOptions((prevState) => !prevState);
                }}
              >
                <HiDotsVertical className="text-xl text-primary" />
              </IconButton>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    className="absolute right-0 z-20 shadow-[0px_0px_5px] shadow-neutral-300 dark:shadow-neutral-900 bg-white dark:bg-neutral-800 rounded-lg mt-2 overflow-hidden"
                    initial={AnimationStage.HIDDEN}
                    animate={AnimationStage.VISIBLE}
                    exit={AnimationStage.HIDDEN}
                    variants={animation}
                  >
                    {allowReviewPlan && (
                      <TERipple
                        rippleColor="light"
                        className="w-full border-b-2 border-b-neutral-100 dark:border-b-neutral-700 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 duration-200"
                        onClick={onUploadReviewReportClick}
                      >
                        <div className="flex flex-row flex-wrap items-center px-5 py-3 w-max text-base font-bold">
                          <FaUpload className="text-lg mb-0.5 mr-5 text-primary-500 dark:text-neutral-400" />

                          <p className="mt-0.5 text-primary-500 dark:text-neutral-400">
                            Upload review file
                          </p>
                        </div>
                      </TERipple>
                    )}
                    <TERipple
                      rippleColor="light"
                      className="w-full border-b-2 border-b-neutral-100 dark:border-b-neutral-700 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 duration-200"
                      onClick={onDownloadClick}
                    >
                      <div className="flex flex-row flex-wrap items-center px-5 py-3 w-max text-base font-bold">
                        <FaDownload className="text-lg mb-0.5 mr-5 text-primary-500 dark:text-neutral-400" />

                        <p className="mt-0.5 text-primary-500 dark:text-neutral-400">
                          Download report
                        </p>
                      </div>
                    </TERipple>
                    {allowReviewPlan && (
                      <TERipple
                        rippleColor="light"
                        className="w-full cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 duration-200"
                        onClick={onMarkAsReviewed}
                      >
                        <div className="flex flex-row flex-wrap items-center px-5 py-3 w-max text-base font-bold">
                          <FaCheck className="text-lg mb-0.5 mr-5 text-primary-500 dark:text-neutral-400" />

                          <p className="mt-0.5 text-primary-500 dark:text-neutral-400">
                            Mark as reviewed
                          </p>
                        </div>
                      </TERipple>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filter section */}
      <div className="relative w-full">
        <AnimatePresence>
          {showFillterBtn && (
            <motion.div
              className="absolute w-full"
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
              variants={staggerChildrenAnimation}
            >
              <motion.div className="flex justify-end mt-4">
                <motion.div variants={childrenAnimation} className="mr-4 ">
                  <CostTypeFilter
                    onChange={(option) => {
                      onCostTypeIdChange && onCostTypeIdChange(option?.value);
                    }}
                  />
                </motion.div>

                <motion.div variants={childrenAnimation} className="mr-4">
                  <StatusExpenseFilter
                    onChange={(option) => {
                      onStatusIdChange && onStatusIdChange(option?.value);
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={AnimationStage.HIDDEN}
          animate={
            showFillterBtn ? AnimationStage.VISIBLE : AnimationStage.HIDDEN
          }
          variants={heightPlaceholderAnimation}
        />
      </div>
    </div>
  );
};
