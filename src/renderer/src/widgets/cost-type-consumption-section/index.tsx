import React, { useState } from "react";
import { Variants, motion } from "framer-motion";
import { MonthlyCostTypeExpenseChart } from "../../widgets/monthly-cost-type-expense-chart";
import { YearlyCostTypeExpenseChart } from "../../widgets/yearly-cost-type-expense-chart";
import { YearFilter } from "../../entities/year-filter";
import {
  CostTypeOption,
  SelectMultiCostType,
} from "../../entities/select-multi-cost-type";

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

export const CostTypeConsumptionSection = React.memo(() => {
  // Select year
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Fetch all cost type
  const [selectedOptions, setSelectedOptions] = useState<CostTypeOption[]>([
    { value: 0, label: "All cost type" },
  ]);

  return (
    <>
      <div className="text-primary-500 text-xl font-extrabold">
        Cost type statistic
      </div>

      <div className="flex flex-row flex-wrap items-center">
        <div className="w-max ml-auto flex flex-row flex-wrap items-center gap-5">
          <SelectMultiCostType
            selectedOptions={selectedOptions}
            onChange={(options) => {
              if (options && options.length > 0) {
                setSelectedOptions(() => {
                  let results = options.map((option) => option);

                  // Remove default option "All cost type" if choose any other value
                  if (options[options.length - 1].value !== 0) {
                    results = results.filter((option) => option.value !== 0);
                  }

                  // If choose "All cost type" option, remove all other option
                  if (options[options.length - 1].value === 0) {
                    results = [{ value: 0, label: "All cost type" }];
                  }

                  return results;
                });
              } else {
                setSelectedOptions([]);
              }
            }}
          />
          <YearFilter
            defaultOption={{ label: year.toString(), value: year }}
            onChange={(option) => option && setYear(option.value)}
          />
        </div>
      </div>

      <motion.div
        className="flex flex-row justify-stretch items-stretch justify-items-stretch mt-3 gap-5 w-full"
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        exit={AnimationStage.HIDDEN}
        variants={staggerChildrenAnimation}
      >
        <motion.div className="flex-[2]" variants={childrenAnimation}>
          <MonthlyCostTypeExpenseChart
            year={year}
            chosenCostTypeIdList={selectedOptions.map(({ value }) => value)}
          />
        </motion.div>
        <motion.div className="flex-1" variants={childrenAnimation}>
          <YearlyCostTypeExpenseChart
            year={year}
            chosenCostTypeIdList={selectedOptions.map(({ value }) => value)}
          />
        </motion.div>
      </motion.div>
    </>
  );
});
