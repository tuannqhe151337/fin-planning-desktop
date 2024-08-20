import { FaClock, FaCoins, FaMoneyBillTrendUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../../shared/utils/cn";
import { useLazyGetPlanDetailQuery } from "../../providers/store/api/plansApi";
import { Tag } from "../../shared/tag";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import { HiUser } from "react-icons/hi";
import { NumericFormat } from "react-number-format";
import { AFFIX } from "../../providers/store/api/type";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

interface Props {
  planId?: string | number;
  children?: React.ReactNode;
  containerClassName?: string;
}

export const PlanPreviewer: React.FC<Props> = ({
  planId,
  children,
  containerClassName,
}) => {
  // Query
  const [fetchPlanDetail, { data: plan, isSuccess }] =
    useLazyGetPlanDetailQuery();

  // Hover state
  const [isHover, setIsHover] = useState<boolean>(false);

  // Load data
  useEffect(() => {
    if (planId && isHover) {
      if (typeof planId === "number") {
        fetchPlanDetail({ planId }, true);
      } else {
        fetchPlanDetail({ planId: parseInt(planId) }, true);
      }
    }
  }, [planId, isHover]);

  return (
    <div
      className={cn("relative w-max m-auto px-5 py-2", containerClassName)}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div>{children}</div>
      <AnimatePresence>
        {isHover && isSuccess && plan && (
          <motion.div
            className="absolute z-10 left-[100%] -top-3 bg-white dark:bg-neutral-800 border dark:border-neutral-800 rounded-lg shadow dark:shadow-lg cursor-auto"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={animation}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="px-7 py-5">
              <div className="flex flex-row flex-wrap items-center w-max gap-3 -mt-1">
                <Link
                  to={`/plan-management/detail/information/${plan.id}`}
                  className="ml-3 text-sm font-extrabold text-neutral-500 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-600 hover:underline duration-200"
                >
                  {plan.name}
                </Link>
                <Tag className="shadow-none">v{plan.version}</Tag>
              </div>

              <div className="mt-2.5 border-b-2 border-neutral-100 dark:border-neutral-600"></div>

              <div className="mt-3.5 mb-0.5  px-2">
                <div className="flex flex-row flex-wrap gap-10 w-max">
                  <div className="space-y-5">
                    {/* Expected cost */}
                    <div className="flex flex-row flex-wrap items-center gap-3 w-max">
                      <FaMoneyBillTrendUp className="text-lg text-neutral-400/30" />
                      <div className="space-y-1">
                        <p className="text-left text-xs text-neutral-400/70 dark:text-neutral-500/80">
                          Expected cost
                        </p>
                        <div className="text-left text-sm font-bold text-neutral-500/80 dark:text-neutral-400">
                          <NumericFormat
                            displayType="text"
                            value={plan?.expectedCost.cost}
                            prefix={
                              plan?.expectedCost.currency.affix === AFFIX.PREFIX
                                ? ` ${plan?.expectedCost.currency.name}`
                                : undefined
                            }
                            suffix={
                              plan?.expectedCost.currency.affix === AFFIX.SUFFIX
                                ? ` ${plan?.expectedCost.currency.name}`
                                : undefined
                            }
                            thousandSeparator
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actual cost */}
                    <div className="flex flex-row flex-wrap items-center gap-3 w-max">
                      <FaCoins className="text-lg text-neutral-400/30" />
                      <div className="space-y-1">
                        <p className="text-left text-xs text-neutral-400/70 dark:text-neutral-500/80">
                          Actual cost
                        </p>
                        <div className="text-left text-sm font-bold text-neutral-500/80 dark:text-neutral-400">
                          <NumericFormat
                            displayType="text"
                            value={plan?.actualCost.cost}
                            prefix={
                              plan?.actualCost.currency.affix === AFFIX.PREFIX
                                ? ` ${plan?.actualCost.currency.name}`
                                : undefined
                            }
                            suffix={
                              plan?.actualCost.currency.affix === AFFIX.SUFFIX
                                ? ` ${plan?.actualCost.currency.name}`
                                : undefined
                            }
                            thousandSeparator
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Created at */}
                    <div className="flex flex-row flex-wrap items-center gap-3 w-max">
                      <FaClock className="text-lg text-neutral-400/30" />
                      <div className="space-y-1">
                        <p className="text-left text-xs text-neutral-400/70 dark:text-neutral-500/80">
                          Created at
                        </p>
                        <p className="text-sm font-bold text-neutral-500/80 dark:text-neutral-400">
                          {(plan?.createdAt &&
                            formatISODateFromResponse(plan?.createdAt)) ||
                            ""}
                        </p>
                      </div>
                    </div>

                    {/* Created by */}
                    <div className="flex flex-row flex-wrap items-center gap-3 w-max">
                      <HiUser className="text-lg text-neutral-400/30" />
                      <div className="space-y-1">
                        <p className="text-left text-xs text-neutral-400/70 dark:text-neutral-500/80">
                          Created by
                        </p>
                        <p className="text-sm font-bold text-neutral-500/80 dark:text-neutral-400">
                          {plan?.user.username}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
