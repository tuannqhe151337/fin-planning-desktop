import { AnimatePresence, Variants, motion } from "framer-motion";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { BubbleBanner } from "../../entities/bubble-banner";
import { FaMoneyBillTrendUp, FaCoins } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import TabList from "../../shared/tab-list";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Skeleton } from "../../shared/skeleton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { OverviewCard } from "../../entities/overview-card";
import {
  ReportDetail,
  useGetReportActualCostQuery,
  useGetReportDetailQuery,
  useGetReportExpectedCostQuery,
  useMarkAsReviewedMutation,
} from "../../providers/store/api/reportsAPI";
import { ReportTag } from "../../entities/report-tag";
import { UploadReviewExpenseModal } from "../../widgets/upload-review-expense-modal";
import { Button } from "../../shared/button";
import { FaDownload, FaUpload } from "react-icons/fa";
import { useIsAuthorizedAndTimeToReviewReport } from "../../features/use-is-authorized-time-to-review-report";
import { useHotkeys } from "react-hotkeys-hook";
import {
  AFFIX,
  LocalStorageItemKey,
  Role,
} from "../../providers/store/api/type";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { NumericFormat } from "react-number-format";
import { IconButton } from "../../shared/icon-button";
import { HiDotsVertical } from "react-icons/hi";
import { useCloseOutside } from "../../shared/hooks/use-close-popup";
import { TERipple } from "tw-elements-react";

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
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

type TabId = "expenses" | "detail";

type ContextType = {
  setShowReportReviewExpensesModal: Dispatch<SetStateAction<boolean>>;
  showReportReviewExpensesModal: boolean;
  report?: ReportDetail;
};

export const ReportDetailRootPage: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Location
  const location = useLocation();

  // Navigation
  const navigate = useNavigate();

  // Parameters
  const { reportId } = useParams<{ reportId: string }>();

  // Query
  const {
    data: report,
    isError,
    isFetching,
    isSuccess,
  } = useGetReportDetailQuery({
    reportId: reportId ? parseInt(reportId) : 0,
  });

  const { data: expectedCostData } = useGetReportExpectedCostQuery({
    reportId: reportId ? parseInt(reportId) : 0,
  });

  const { data: actualCostData } = useGetReportActualCostQuery({
    reportId: reportId ? parseInt(reportId) : 0,
  });

  // Mark as reviewed
  const [markAsReviewed] = useMarkAsReviewedMutation();

  // Tablist state
  const [selectedTabId, setSelectedTabId] = useState<TabId>("expenses");

  useEffect(() => {
    const currentTabUrl = location.pathname
      .replace("/report-management/detail/", "")
      .split("/")[0];

    switch (currentTabUrl) {
      case "expenses":
        setSelectedTabId("expenses");
        break;

      case "information":
        setSelectedTabId("detail");
        break;
    }
  }, [location]);

  // UI: upload report's expenses modal
  const [showReportReviewExpensesModal, setShowReportReviewExpensesModal] =
    useState<boolean>(false);

  const isAuthorizedAndTimeToReviewReport =
    useIsAuthorizedAndTimeToReviewReport({
      reportStatusCode: report?.status.code,
      termEndDate: report?.term.endDate,
      allowReupload: report?.term.allowReupload,
      termReuploadStartDate: report?.term.reuploadStartDate,
      termReuploadEndDate: report?.term.reuploadEndDate,
      finalEndTermDate: report?.term.finalEndTermDate,
    });

  useHotkeys("ctrl + u", (e) => {
    e.preventDefault();
    setShowReportReviewExpensesModal(true);
  });

  // UI: show options
  const [showOptions, setShowOptions] = useState(false);

  const ref = useCloseOutside({
    open: showOptions,
    onClose: () => {
      setShowOptions(false);
    },
  });

  return (
    <motion.div
      className="px-6 pb-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto">
          {/* Left */}
          <p className="text-primary dark:text-primary/70 font-extrabold text-lg w-fit ml-7 space-x-2">
            <Link
              to={`/report-management`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              Report management
            </Link>
            <span className="ml-3 text-base opacity-40">&gt;</span>
            <span>Report detail</span>
          </p>

          {/* Right */}
          <div className="ml-auto">
            <Button
              variant={
                isAuthorizedAndTimeToReviewReport ? "tertiary" : "primary"
              }
              onClick={() => {
                const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

                if (token && report && reportId) {
                  downloadFileFromServer(
                    `${
                      import.meta.env.VITE_BACKEND_HOST
                    }report/download-xlsx?reportId=${reportId}`,
                    token,
                    `${report.name}.xlsx`
                  );
                }
              }}
            >
              <div className="flex flex-row flex-wrap gap-3">
                <FaDownload />
                <p className="text-sm font-bold">Download report</p>
              </div>
            </Button>
            {isAuthorizedAndTimeToReviewReport && (
              <Button
                containerClassName="ml-3"
                onClick={() => {
                  setShowReportReviewExpensesModal(true);
                }}
              >
                <div className="flex flex-row flex-wrap gap-3">
                  <FaUpload className="mt-0.5" />
                  <p className="text-sm font-semibold">Upload review file</p>
                </div>
              </Button>
            )}
          </div>
        </div>
      </BubbleBanner>

      {/* Title section */}
      <motion.div className="mt-6 px-7" variants={childrenAnimation}>
        {/* Title text */}
        <div className="flex flex-row items-center">
          <div className="relative w-full h-[32px]">
            <AnimatePresence>
              {isFetching && <Skeleton className="w-[500px] h-[32px]" />}
              {!isFetching && !isError && isSuccess && (
                <motion.div
                  className="flex flex-row flex-wrap items-center"
                  variants={animation}
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                >
                  <p className="text-2xl font-extrabold text-primary mr-5">
                    {report?.name}
                  </p>
                  <ReportTag statusCode={report.status.code} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Three dots  */}
          {isAuthorizedAndTimeToReviewReport && (
            <div className="relative" ref={ref}>
              <IconButton
                tooltip="More"
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
                      className="w-full cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 duration-200"
                      onClick={() => {
                        reportId &&
                          markAsReviewed({ reportId: parseInt(reportId) });
                      }}
                    >
                      <div className="flex flex-row flex-wrap items-center px-5 py-3 w-max text-base font-bold">
                        <FaCheck className="text-lg mr-5 text-primary-500/80 dark:text-neutral-400" />

                        <p className="mt-0.5 text-primary-500 dark:text-neutral-400">
                          Mark as reviewed
                        </p>
                      </div>
                    </TERipple>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-between gap-5 mt-10 px-5 w-full">
        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<RiCalendarScheduleFill className="text-4xl" />}
            label={"Term"}
            isFetching={isFetching}
            value={report?.term.name}
            meteors
          />
        </motion.div>

        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<FaMoneyBillTrendUp className="text-4xl" />}
            label={"Expected cost"}
            isFetching={isFetching}
            value={
              <NumericFormat
                displayType="text"
                value={expectedCostData?.cost}
                prefix={
                  expectedCostData?.currency.affix === AFFIX.PREFIX
                    ? ` ${expectedCostData?.currency.name}`
                    : undefined
                }
                suffix={
                  expectedCostData?.currency.affix === AFFIX.SUFFIX
                    ? ` ${expectedCostData?.currency.name}`
                    : undefined
                }
                thousandSeparator
              />
            }
          />
        </motion.div>

        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<FaCoins className="text-4xl" />}
            label={"Actual cost"}
            isFetching={isFetching}
            value={
              <NumericFormat
                displayType="text"
                value={actualCostData?.cost}
                prefix={
                  actualCostData?.currency.affix === AFFIX.PREFIX
                    ? ` ${actualCostData?.currency.name}`
                    : undefined
                }
                suffix={
                  actualCostData?.currency.affix === AFFIX.SUFFIX
                    ? ` ${actualCostData?.currency.name}`
                    : undefined
                }
                thousandSeparator
              />
            }
          />
        </motion.div>
      </div>

      <div className="mt-7 px-5 pb-32">
        <div className="relative w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl py-7 px-8">
          <div className="border-b-2 border-b-neutral-200 dark:border-b-neutral-700">
            <TabList
              className="-mb-0.5"
              selectedItemId={selectedTabId}
              items={[
                { id: "expenses", name: "Expenses" },
                { id: "detail", name: "Detail" },
              ]}
              onItemChangeHandler={({ id }) => {
                switch (id) {
                  case "expenses":
                    navigate(`./expenses/${reportId}`);
                    break;

                  case "detail":
                    navigate(`./information/${reportId}`);
                    break;

                  default:
                    break;
                }
              }}
            />
          </div>

          <motion.div layout>
            <Outlet
              context={{
                setShowReportReviewExpensesModal,
                showReportReviewExpensesModal,
                report,
              }}
            />
          </motion.div>
        </div>
      </div>

      <UploadReviewExpenseModal
        reportId={reportId}
        show={showReportReviewExpensesModal}
        onClose={() => {
          setShowReportReviewExpensesModal(false);
        }}
      />
    </motion.div>
  );
};

export const useReportDetailContext = () => {
  return useOutletContext<ContextType>();
};
