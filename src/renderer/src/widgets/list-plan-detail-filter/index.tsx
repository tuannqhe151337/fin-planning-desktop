import { AnimatePresence, Variants, motion } from "framer-motion";
import { SearchBox } from "../../shared/search-box";
import { IconButton } from "../../shared/icon-button";
import { RiDeleteRow } from "react-icons/ri";
import { Button } from "../../shared/button";
import { FaDownload, FaUpload } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { FaFilter } from "react-icons/fa6";
import { useState } from "react";
import { TERipple } from "tw-elements-react";
import { useCloseOutside } from "../../shared/hooks/use-close-popup";
import { CostTypeFilter } from "../../entities/cost-type-filter";
import { StatusPlanFilter } from "../../entities/status-plan-filter";
import clsx from "clsx";
import { CurrencyChanger } from "../../entities/currency-changer";
import { Currency } from "../../providers/store/api/currencyApi";

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
  currencyId?: number;
  showReviewExpense?: boolean;
  searchboxValue?: string;
  showReupload?: boolean;
  onSearchboxChange?: (value: string) => any;
  onCostTypeIdChange?: (costTypeId: number | null | undefined) => any;
  onStatusIdChange?: (statusId: number | null | undefined) => any;
  onCurrencyChoose?: (currency?: Currency) => any;
  onApproveExpensesClick?: () => any;
  onDenyExpensesClick?: () => any;
  onDownloadClick?: () => any;
  onReuploadClick?: () => any;
}

export const ListPlanDetailFilter: React.FC<Props> = ({
  className,
  currencyId,
  showReviewExpense,
  searchboxValue,
  showReupload,
  onSearchboxChange,
  onCostTypeIdChange,
  onStatusIdChange,
  onCurrencyChoose,
  onApproveExpensesClick,
  onDenyExpensesClick,
  onDownloadClick,
  onReuploadClick,
}) => {
  // Filter section
  const [showFilterBtn, setShowFillterBtn] = useState(false);

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
          <CurrencyChanger
            chosenCurrencyId={currencyId}
            onCurrencyChoose={onCurrencyChoose}
          />

          {/* Filter icon */}
          <motion.div variants={childrenAnimation}>
            <IconButton
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
                    <TERipple
                      rippleColor="light"
                      className={clsx({
                        "w-full cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-base font-bold duration-200":
                          true,
                        "border-b-2 border-b-neutral-100 dark:border-b-neutral-700":
                          showReupload,
                      })}
                      onClick={() => {
                        onDownloadClick && onDownloadClick();
                      }}
                    >
                      <div className="flex flex-row flex-wrap items-center w-max px-5 py-3">
                        <FaDownload className="mb-0.5 mr-5 text-primary-500 dark:text-neutral-400" />
                        <p className="mt-0.5 text-primary-500 dark:text-neutral-400">
                          Download plan
                        </p>
                      </div>
                    </TERipple>
                    {showReupload && (
                      <TERipple
                        rippleColor="light"
                        className="w-full cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-base font-bold duration-200"
                        onClick={() => {
                          onReuploadClick && onReuploadClick();
                        }}
                      >
                        <div className="flex flex-row flex-wrap items-center w-max px-5 py-3">
                          <FaUpload className="mr-5 text-primary-500 dark:text-neutral-400" />
                          <p className="mt-0.5 text-primary-500 dark:text-neutral-400">
                            Reupload plan
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
          {showFilterBtn && (
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
                  <StatusPlanFilter
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
            showFilterBtn ? AnimationStage.VISIBLE : AnimationStage.HIDDEN
          }
          variants={heightPlaceholderAnimation}
        />
      </div>
    </div>
  );
};
