import { Pagination } from "../../shared/pagination";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AnnualReport } from "../../providers/store/api/annualsAPI";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import { formatViMoney } from "../../shared/utils/format-vi-money";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../shared/skeleton";
import { AnnualReportActionContextMenu } from "../../entities/annual-report-action-context-menu";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { LocalStorageItemKey } from "../../providers/store/api/type";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";

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

export interface Row extends AnnualReport {
  isFetching?: boolean;
}

interface Props {
  onCreatePlanClick?: () => any;
  isFetching?: boolean;
  annual?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TableAnnualReport: React.FC<Props> = ({
  annual: annualReports,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // Navigation
  const navigate = useNavigate();

  const { t } = useTranslation(["table-annual-report"]);

  // UI: context menu
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuTop, setContextMenuTop] = useState<number>(0);
  const [contextMenuLeft, setContextMenuLeft] = useState<number>(0);
  const [chosenAnnualReport, setChosenAnnualReport] = useState<AnnualReport>();

  useEffect(() => {
    const clickHandler = () => {
      setShowContextMenu(false);
    };

    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  }, []);

  useHotkeys("esc", () => {
    setShowContextMenu(false);
  });

  return (
    <div>
      <table className="text-center text-sm font-light mt-6 min-w-full shadow overflow-hidden rounded-lg">
        <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Report")}
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Total expense")}
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Total term")}
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Total department")}
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Created date")}
            </th>
          </tr>
        </thead>
        <tbody>
          {annualReports &&
            annualReports.map((annualReport, index) => (
              <tr
                key={index}
                className={clsx({
                  "group cursor-pointer border-b-2 border-neutral-100 dark:border-neutral-800 duration-200":
                    true,
                  "text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-400":
                    true,
                  "bg-white hover:bg-primary-50/50 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/70":
                    index % 2 === 0,
                  "bg-primary-50 hover:bg-primary-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-800":
                    index % 2 === 1,
                })}
                // onMouseEnter={() => {
                //   setHoverRowIndex(index);
                // onMouseLeave={() => {
                //   setHoverRowIndex(undefined);
                // }}
                onClick={() => {
                  navigate(
                    `detail/chart/${parseISOInResponse(
                      annualReport.name
                    ).getFullYear()}`
                  );
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowContextMenu(true);
                  setContextMenuLeft(e.pageX);
                  setContextMenuTop(e.pageY);
                  setChosenAnnualReport(annualReport);
                }}
              >
                <td className="whitespace-nowrap px-6 py-6 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <div className="font-extrabold group-hover:underline">
                      Report {annualReport.name}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-6 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <div> {formatViMoney(annualReport.totalExpense)}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-6 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <div> {annualReport.totalTerm}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-6 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <div> {annualReport.totalDepartment}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-6 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <div>
                      {formatISODateFromResponse(annualReport.createdAt)}
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isDataEmpty && (
        <div className="flex flex-row flex-wrap items-center justify-center w-full min-h-[250px] text-lg font-semibold text-neutral-400 italic">
          No data found.
        </div>
      )}
      {!isDataEmpty && (
        <motion.div
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={animation}
        >
          <Pagination
            className="mt-6"
            page={page}
            totalPage={totalPage || 1}
            onNext={onNext}
            onPageChange={onPageChange}
            onPrevious={onPrevious}
          />
        </motion.div>
      )}

      <AnnualReportActionContextMenu
        show={showContextMenu}
        top={contextMenuTop}
        left={contextMenuLeft}
        onOverviewClick={() => {
          navigate(
            `/annual-report/detail/chart/${chosenAnnualReport?.annualReportId}`
          );
        }}
        onDetailClick={() => {
          navigate(
            `/annual-report/detail/table/${chosenAnnualReport?.annualReportId}`
          );
        }}
        onDownloadClick={() => {
          const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

          if (token && chosenAnnualReport) {
            downloadFileFromServer(
              `${
                import.meta.env.VITE_BACKEND_HOST
              }annual-report/download-xlsx?annualReportId=${
                chosenAnnualReport.annualReportId
              }`,
              token,
              `annual-report-${parseISOInResponse(
                chosenAnnualReport.createdAt
              ).getFullYear()}.xlsx`
            );
          }
        }}
      />
    </div>
  );
};
