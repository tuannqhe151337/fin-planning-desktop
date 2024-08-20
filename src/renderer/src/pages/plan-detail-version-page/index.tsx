import { AnimatePresence, Variants, motion } from "framer-motion";
import clsx from "clsx";
import { format } from "date-fns";
import { BsStack } from "react-icons/bs";
import { useParams } from "react-router-dom";
import {
  useGetPlanDetailQuery,
  useLazyGetPlanVersionQuery,
} from "../../providers/store/api/plansApi";
import { useEffect, useState } from "react";
import { useInfiteLoaderWholePage } from "../../shared/hooks/use-infite-loader-whole-page";
import { Skeleton } from "../../shared/skeleton";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { LocalStorageItemKey } from "../../providers/store/api/type";

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
    y: 5,
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

const pageSize = 10;

export const PlanDetailVersionPage: React.FC = () => {
  // Get planId from param
  const { planId } = useParams<{ planId: string }>();

  // Query
  const { data: plan } = useGetPlanDetailQuery({
    planId: planId ? parseInt(planId) : 0,
  });

  // Current load page
  const [currentLoadPage, setCurrentLoadPage] = useState<number>(1);

  // Fetch data
  const [getListProductQuery, { data, isFetching }] =
    useLazyGetPlanVersionQuery();

  useEffect(() => {
    if (planId) {
      getListProductQuery({
        planId,
        page: 1,
        pageSize,
      });

      setCurrentLoadPage(1);
    }
  }, []);

  // Infinite scroll
  useInfiteLoaderWholePage(() => {
    if (planId) {
      if (data && data.data.length < data.pagination.totalRecords) {
        getListProductQuery({
          planId,
          page: data.pagination.page + 1,
          pageSize,
        });

        setCurrentLoadPage(data.pagination.page + 1);
      }
    }
  });

  return (
    <motion.div
      className="flex flex-col flex-wrap py-5 px-4"
      variants={staggerChildrenAnimation}
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
    >
      <motion.div
        className="flex flex-row flex-wrap items-center ml-auto"
        variants={childrenAnimation}
      >
        <BsStack className="text-xl text-primary-300 dark:text-primary-700 mr-4" />
        <div>
          <AnimatePresence>
            {!data ||
              (!data.pagination && (
                <motion.div
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                >
                  <Skeleton className="h-[28px] w-[150px]" />
                </motion.div>
              ))}
            {data?.pagination && data.pagination.totalRecords && (
              <motion.div
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
              >
                <span className="text-lg font-extrabold text-primary-400 dark:text-primary-600 mr-1.5">
                  {data?.pagination.totalRecords}
                </span>
                <span className="text-base font-bold text-primary-400/80 dark:text-primary-600/90">
                  total version
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.table className="mt-5" variants={childrenAnimation}>
        <thead className="border-b-2 border-neutral-100 dark:border-neutral-800">
          <tr>
            <th className="py-3 text-neutral-400 font-bold text-base">
              Version
            </th>
            <th className="py-3 text-neutral-400 font-bold text-base">
              Published date
            </th>
            <th></th>
            <th className="py-3 text-neutral-400 font-bold text-base text-center">
              Uploaded by
            </th>
          </tr>
        </thead>

        <motion.tbody
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={staggerChildrenAnimation}
        >
          {(!isFetching || currentLoadPage !== 1) &&
            data?.data.map(({ version, publishedDate, uploadedBy }, i) => (
              <motion.tr
                key={version}
                className={clsx({
                  "group cursor-pointer hover:text-neutral-500 duration-200":
                    true,
                  "h-[61px] bg-neutral-50 dark:bg-neutral-800/50": i % 2 === 1,
                  "text-neutral-500/90 dark:text-neutral-400": i === 0,
                  "text-neutral-400 dark:text-neutral-400/80": i !== 0,
                })}
                variants={rowAnimation}
                onClick={() => {
                  const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

                  if (token && planId && plan) {
                    downloadFileFromServer(
                      `${
                        import.meta.env.VITE_BACKEND_HOST
                      }plan/download/xlsx?planId=${planId}`,
                      token,
                      `${plan.name}-v${version}.xlsx`
                    );
                  }
                }}
              >
                <td className="text-sm font-bold text-center py-5 w-[150px] group-hover:underline duration-200">
                  {version} {i === 0 && "(current)"}
                </td>
                <td className="text-sm font-bold text-center py-5 w-[200px]">
                  {format(publishedDate, "dd MMMM yyyy")}
                </td>
                <td></td>
                <td className="text-sm font-bold text-center py-5 w-[150px]">
                  {uploadedBy.username}
                </td>
              </motion.tr>
            ))}

          {isFetching &&
            new Array(2).fill(true).map((_, index) => (
              <motion.tr
                key={-index}
                className="border-b-2 border-neutral-100"
                variants={rowAnimation}
              >
                <td className="py-2">
                  <Skeleton className="w-[150px]" />
                </td>
                <td className="py-2">
                  <Skeleton className="w-[170px] mx-[15px]" />
                </td>
                <td className="w-full"></td>
                <td className="py-2">
                  <Skeleton className="w-[150px]" />
                </td>
              </motion.tr>
            ))}
        </motion.tbody>
      </motion.table>
    </motion.div>
  );
};
