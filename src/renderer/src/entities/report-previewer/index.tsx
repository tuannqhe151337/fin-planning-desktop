import { FaClock, FaCoins, FaMoneyBillTrendUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../../shared/utils/cn";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import {
  useLazyGetReportActualCostQuery,
  useLazyGetReportDetailQuery,
  useLazyGetReportExpectedCostQuery,
} from "../../providers/store/api/reportsAPI";
import { ReportTag } from "../report-tag";
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
  reportId?: string | number;
  children?: React.ReactNode;
  containerClassName?: string;
}

export const ReportPreviewer: React.FC<Props> = ({
  reportId,
  children,
  containerClassName,
}) => {
  // Query
  const [fetchReportDetail, { data: report, isSuccess }] =
    useLazyGetReportDetailQuery();
  const [fetchActualCost, { data: actualCostData }] =
    useLazyGetReportActualCostQuery();
  const [fetchExpectedCost, { data: expectedCostData }] =
    useLazyGetReportExpectedCostQuery();

  // Hover state
  const [isHover, setIsHover] = useState<boolean>(false);

  // Load data
  useEffect(() => {
    if (reportId && isHover) {
      if (typeof reportId === "number") {
        fetchReportDetail({ reportId }, true);
        fetchActualCost({ reportId }, true);
        fetchExpectedCost({ reportId }, true);
      } else {
        fetchReportDetail({ reportId: parseInt(reportId) }, true);
        fetchActualCost({ reportId: parseInt(reportId) }, true);
        fetchExpectedCost({ reportId: parseInt(reportId) }, true);
      }
    }
  }, [reportId, isHover]);

  return (
    <div
      className={cn("relative w-max", containerClassName)}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div>{children}</div>
      <AnimatePresence>
        {isHover &&
          isSuccess &&
          report &&
          expectedCostData &&
          actualCostData && (
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
                    to={`/plan-management/detail/information/${report.id}`}
                    className="ml-3 text-sm font-extrabold text-neutral-500 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-600 hover:underline duration-200"
                  >
                    {report.name}
                  </Link>
                  <ReportTag
                    className="shadow-none"
                    statusCode={report.status.code}
                  />
                </div>

                <div className="mt-2.5 border-b-2 border-neutral-100 dark:border-neutral-600"></div>

                <div className="mt-3.5 mb-0.5  px-2">
                  <div className="flex flex-row flex-wrap gap-10 w-max">
                    <div className="space-y-5">
                      {/* Actual cost */}
                      <div className="flex flex-row flex-wrap items-center gap-3 w-max">
                        <FaMoneyBillTrendUp className="text-lg text-neutral-400/30" />
                        <div className="space-y-1">
                          <p className="text-left text-xs text-neutral-400/70 dark:text-neutral-500/80">
                            Actual cost
                          </p>
                          <p className="text-left text-sm font-bold text-neutral-500/80 dark:text-neutral-400">
                            <NumericFormat
                              displayType="text"
                              value={expectedCostData?.cost}
                              prefix={
                                expectedCostData?.currency.affix ===
                                AFFIX.PREFIX
                                  ? ` ${expectedCostData?.currency.name}`
                                  : undefined
                              }
                              suffix={
                                expectedCostData?.currency.affix ===
                                AFFIX.SUFFIX
                                  ? ` ${expectedCostData?.currency.name}`
                                  : undefined
                              }
                              thousandSeparator
                            />
                          </p>
                        </div>
                      </div>

                      {/* Expected cost */}
                      <div className="flex flex-row flex-wrap items-center gap-3 w-max">
                        <FaCoins className="text-lg text-neutral-400/30" />
                        <div className="space-y-1">
                          <p className="text-left text-xs text-neutral-400/70 dark:text-neutral-500/80">
                            Expected cost
                          </p>
                          <p className="text-left text-sm font-bold text-neutral-500/80 dark:text-neutral-400">
                            <NumericFormat
                              displayType="text"
                              value={expectedCostData?.cost}
                              prefix={
                                expectedCostData?.currency.affix ===
                                AFFIX.PREFIX
                                  ? ` ${expectedCostData?.currency.name}`
                                  : undefined
                              }
                              suffix={
                                expectedCostData?.currency.affix ===
                                AFFIX.SUFFIX
                                  ? ` ${expectedCostData?.currency.name}`
                                  : undefined
                              }
                              thousandSeparator
                            />
                          </p>
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
                            {(report?.createdAt &&
                              formatISODateFromResponse(report?.createdAt)) ||
                              ""}
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
