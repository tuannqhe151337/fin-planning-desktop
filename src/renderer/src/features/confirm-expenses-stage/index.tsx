import React from "react";
import { Variants, motion } from "framer-motion";
import { Button } from "../../shared/button";
import { ConfirmExpensesTable } from "./components/confirm-expenses-table";
import { CgSpinner } from "react-icons/cg";
import { Expense } from "../upload-file-stage/type";

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
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

interface Props {
  inputSection?: React.ReactNode;
  submitButtonText?: string;
  isLoading?: boolean;
  termName?: string;
  planName?: string;
  expenses?: Expense[];
  showExpenseIdColumn?: boolean;
  showExpenseCodeColumn?: boolean;
  showStatusColumn?: boolean;
  pageSize?: number;
  hide?: boolean;
  onPreviousState?: () => any;
  onNextStage?: () => any;
}

export const ConfirmExpensesStage: React.FC<Props> = ({
  inputSection,
  submitButtonText,
  isLoading,
  expenses,
  showExpenseIdColumn,
  showExpenseCodeColumn,
  showStatusColumn,
  hide,
  onPreviousState,
  onNextStage,
}) => {
  return (
    <motion.div
      className="w-max"
      initial={AnimationStage.HIDDEN}
      animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      {/* Disabled term and department select box */}
      <motion.div variants={childrenAnimation}>{inputSection}</motion.div>

      {/* Table */}
      <ConfirmExpensesTable
        expenses={expenses}
        hide={hide}
        showExpenseIdColumn={showExpenseIdColumn}
        showExpenseCodeColumn={showExpenseCodeColumn}
        showStatusColumn={showStatusColumn}
      />

      {/* Buttons */}
      <div className="flex flex-row flex-wrap items-center gap-5 mt-4 w-full">
        <Button
          disabled={isLoading}
          variant="tertiary"
          className="w-[300px]"
          onClick={() => {
            onPreviousState && onPreviousState();
          }}
        >
          Back
        </Button>
        <Button
          disabled={isLoading}
          containerClassName="flex-1"
          onClick={() => {
            onNextStage && onNextStage();
          }}
        >
          {!isLoading && submitButtonText}
          {isLoading && <CgSpinner className="m-auto text-lg animate-spin" />}
        </Button>
      </div>
    </motion.div>
  );
};
