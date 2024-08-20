import { Variants, motion } from "framer-motion";
import { RiCalendarScheduleFill, RiProgress3Fill } from "react-icons/ri";
import { DetailPropertyItem } from "../../entities/detail-property-item";
import { FaCheck, FaClock, FaFileImport } from "react-icons/fa6";
import { SiClockify } from "react-icons/si";
import { useParams } from "react-router-dom";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import { useGetReportDetailQuery } from "../../providers/store/api/reportsAPI";
import clsx from "clsx";
import { format } from "date-fns";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";

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

export const ReportDetailInformationPage: React.FC = () => {
  // Parameters
  const { reportId } = useParams<{ reportId: string }>();

  // Query
  const { data: report, isFetching } = useGetReportDetailQuery({
    reportId: reportId ? parseInt(reportId, 10) : 0,
  });

  return (
    <motion.div
      className="flex flex-row flex-wrap w-full px-4 py-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <div className="flex flex-col flex-wrap flex-1 gap-9">
        {/* Term */}
        <motion.div variants={childrenAnimation}>
          <DetailPropertyItem
            isFetching={isFetching}
            icon={<RiCalendarScheduleFill className="text-3xl" />}
            title="Term"
            value={report?.term.name}
          />
        </motion.div>

        {/* Start-end term */}
        <motion.div variants={childrenAnimation}>
          <DetailPropertyItem
            isFetching={isFetching}
            icon={<SiClockify className="text-3xl" />}
            title="Start - end term"
            value={`${format(
              parseISOInResponse(report?.term.startDate),
              "dd/MM/yyyy"
            )} - ${format(
              parseISOInResponse(report?.term.endDate),
              "dd/MM/yyyy"
            )}`}
          />
        </motion.div>

        {/* Reupload period */}
        {report?.term.allowReupload && (
          <motion.div variants={childrenAnimation}>
            <DetailPropertyItem
              isFetching={isFetching}
              icon={<FaFileImport className="text-3xl -ml-1 mr-1" />}
              title="Reupload plan period"
              value={`${format(
                parseISOInResponse(report?.term.reuploadStartDate),
                "dd/MM/yyyy"
              )} - ${format(
                parseISOInResponse(report?.term.reuploadEndDate),
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
                  "text-green-600": report?.status.code === "APPROVED",
                  "text-primary-400 dark:text-primary-600":
                    report?.status.code === "REVIEWED",
                })}
              />
            }
            title="Status"
            value={
              <div
                className={clsx({
                  "flex flex-row flex-wrap items-center gap-2": true,
                  "text-green-600": report?.status.code === "APPROVED",
                  "text-primary-500":
                    report?.status.code === "REVIEWED" ||
                    report?.status.code === "WAITING_FOR_APPROVAL",
                  "text-green-500 dark:text-green-600":
                    report?.status.code === "NEW",
                })}
              >
                <p
                  className={clsx({
                    "font-extrabold": true,
                  })}
                >
                  {report?.status.name}
                </p>
                {report?.status.code === "REVIEWED" ||
                report?.status.code === "APPROVED" ? (
                  <FaCheck className="mb-0.5" />
                ) : null}
              </div>
            }
          />
        </motion.div>

        {/* Created at */}
        <motion.div variants={childrenAnimation}>
          <DetailPropertyItem
            isFetching={isFetching}
            icon={<FaClock className="text-2xl ml-1" />}
            title="Created at"
            value={
              (report?.createdAt &&
                formatISODateFromResponse(report?.createdAt)) ||
              ""
            }
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
