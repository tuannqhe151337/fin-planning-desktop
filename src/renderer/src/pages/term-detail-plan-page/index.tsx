import { useEffect } from "react";
import { Variants, motion } from "framer-motion";
import { FaChartLine } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyFetchInfinteScrollPlansOfTermQuery } from "../../providers/store/api/plansApi";
import { PlanPreviewer } from "../../entities/plan-previewer";
import clsx from "clsx";
import { useInfiteLoaderWholePage } from "../../shared/hooks/use-infite-loader-whole-page";
import { Skeleton } from "../../shared/skeleton";

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

// TODO: Fetch infinite plan
const pageSize = 10;

export const TermDetailPlanPage: React.FC = () => {
  const navigate = useNavigate();

  const { termId } = useParams<{ termId: string }>();

  // Fetch data
  const [getListPlanOfTerm, { data: plans, isFetching, isSuccess }] =
    useLazyFetchInfinteScrollPlansOfTermQuery();

  useEffect(() => {
    try {
      let termIdInt = 0;

      if (termId) {
        if (typeof termId === "string") {
          termIdInt = parseInt(termId);
        } else {
          termIdInt = termId;
        }
      }

      if (termIdInt) {
        getListPlanOfTerm({
          termId: termIdInt,
          page: 1,
          pageSize,
        });
      }
    } catch (_) {}
  }, []);

  // Infinite scroll
  useInfiteLoaderWholePage(() => {
    try {
      let termIdInt = 0;

      if (termId) {
        if (typeof termId === "string") {
          termIdInt = parseInt(termId);
        } else {
          termIdInt = termId;
        }
      }

      if (
        plans &&
        plans.data.length < plans.pagination.totalRecords &&
        termIdInt
      ) {
        getListPlanOfTerm({
          termId: termIdInt,
          page: plans.pagination.page + 1,
          pageSize,
        });
      }
    } catch (_) {}
  });

  return (
    <motion.div
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={staggerChildrenAnimation}
    >
      {isSuccess &&
        plans.data.length === 0 &&
        plans.pagination.totalRecords === 0 && (
          <div className="ml-5 mt-6 text-neutral-300 dark:text-neutral-600 italic font-semibold">
            No plans in this term
          </div>
        )}

      <motion.table
        className="text-sm font-light mt-3 min-w-full"
        variants={childrenAnimation}
      >
        <tbody>
          <tr className="flex flex-col flex-wrap">
            {plans?.data.map((plan, index) => (
              <td
                className={clsx({
                  "group px-6 py-3 rounded-lg cursor-pointer duration-200":
                    true,
                  "bg-white hover:bg-neutral-50/50 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/70":
                    index % 2 === 0,
                  "bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-800":
                    index % 2 === 1,
                })}
                onClick={() => {
                  navigate(`/plan-management/detail/expenses/${plan.planId}`);
                }}
              >
                <div className="flex flex-row flex-wrap">
                  <div className="text-neutral-400/80 dark:text-neutral-600">
                    <FaChartLine className="text-xl mt-2" />
                  </div>
                  <PlanPreviewer containerClassName="ml-0" planId={plan.planId}>
                    <p className="font-extrabold text-neutral-500/80 dark:text-neutral-500 group-hover:underline duration-200">
                      {plan.name}
                    </p>
                  </PlanPreviewer>
                </div>
              </td>
            ))}

            {isFetching &&
              new Array(2).fill(true).map((_, index) => (
                <tr key={-index} className="border-b-2 border-neutral-100">
                  <td className="py-2">
                    <Skeleton className="w-[20px]" />
                  </td>
                  <td className="py-2">
                    <Skeleton className="w-[300px]" />
                  </td>
                </tr>
              ))}
          </tr>
        </tbody>
      </motion.table>
    </motion.div>
  );
};
