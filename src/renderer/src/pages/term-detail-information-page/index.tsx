import { Variants, motion } from "framer-motion";
import { DetailPropertyItem } from "../../entities/detail-property-item";
import { useParams } from "react-router-dom";
import { useLazyFetchTermDetailQuery } from "../../providers/store/api/termApi";
import { useEffect } from "react";
import { SiClockify } from "react-icons/si";
import { format } from "date-fns";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";
import { FaFileImport } from "react-icons/fa6";
import { capitalizeFirstLetter } from "../../shared/utils/capitalized-string";
import { RiCalendarScheduleFill, RiProgress3Fill } from "react-icons/ri";
import clsx from "clsx";

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

export const TermDetailInformationPage: React.FC = () => {
  // Get annual report expense
  const { termId } = useParams<{ termId: string }>();

  const [fetchTermReportDetail, { data: term, isFetching }] =
    useLazyFetchTermDetailQuery();

  useEffect(() => {
    if (termId) {
      fetchTermReportDetail(parseInt(termId, 10), true);
    }
  }, [termId]);

  return (
    <motion.div
      className="flex flex-row flex-wrap w-full px-4 py-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <div className="flex flex-col flex-wrap flex-1 gap-9">
        {/* Term name */}
        <motion.div variants={childrenAnimation}>
          <DetailPropertyItem
            isFetching={isFetching}
            icon={<RiCalendarScheduleFill className="text-3xl" />}
            title="Term"
            value={term?.name}
          />
        </motion.div>

        {/* Start-end date */}
        <motion.div variants={childrenAnimation}>
          <DetailPropertyItem
            isFetching={isFetching}
            icon={<SiClockify className="text-2xl" />}
            title={capitalizeFirstLetter(term?.duration)}
            value={`${format(
              parseISOInResponse(term?.startDate),
              "dd/MM/yyyy"
            )} - ${format(parseISOInResponse(term?.endDate), "dd/MM/yyyy")}`}
          />
        </motion.div>

        {/* Reupload period */}
        {term?.allowReupload && (
          <motion.div variants={childrenAnimation}>
            <DetailPropertyItem
              isFetching={isFetching}
              icon={<FaFileImport className="text-2xl -ml-1 mr-1" />}
              title="Reupload plan period"
              value={`${format(
                parseISOInResponse(term?.reuploadStartDate),
                "dd/MM/yyyy"
              )} - ${format(
                parseISOInResponse(term?.reuploadEndDate),
                "dd/MM/yyyy"
              )}`}
            />
          </motion.div>
        )}
      </div>

      <div className="flex flex-col flex-wrap flex-1 gap-9">
        {/* Status */}
        <motion.div variants={childrenAnimation}>
          <DetailPropertyItem
            isFetching={isFetching}
            icon={
              <RiProgress3Fill
                className={clsx({
                  "text-3xl": true,
                  "text-green-600": term?.status.code === "APPROVED",
                  "text-primary-400 dark:text-primary-600":
                    term?.status.code === "REVIEWED",
                })}
              />
            }
            title="Status"
            value={
              <div
                className={clsx({
                  "flex flex-row flex-wrap items-center gap-2": true,
                  "text-neutral-500": term?.status.code === "CLOSED",
                  "text-primary-500": term?.status.code === "IN_PROGRESS",
                  "text-green-500 dark:text-green-600":
                    term?.status.code === "NEW",
                })}
              >
                <p
                  className={clsx({
                    "font-extrabold": true,
                  })}
                >
                  {term?.status.name}
                </p>
              </div>
            }
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
