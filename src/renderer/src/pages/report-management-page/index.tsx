import { useCallback, useEffect, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Variants, motion } from "framer-motion";
import { Row, TableReportManagement } from "../../widgets/table-report";
import {
  ListReportParameters,
  reportsAPI,
  useLazyFetchReportsQuery,
  useMarkAsReviewedMutation,
} from "../../providers/store/api/reportsAPI";
import _ from "lodash";
import { ListReportFilter } from "../../widgets/list-report-filter";
import { useDispatch } from "react-redux";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";
import { toast } from "react-toastify";
import { useDetectDarkmode } from "../../shared/hooks/use-detect-darkmode";

const generateEmptyReports = (total: number): Row[] => {
  const reports: Row[] = [];

  for (let i = 0; i < total; i++) {
    reports.push({
      reportId: 0,
      name: "",
      version: "",
      month: "",
      term: {
        termId: 0,
        name: "",
        startDate: "",
        endDate: "",
        allowReupload: false,
        reuploadStartDate: "",
        reuploadEndDate: "",
        finalEndTermDate: "",
      },
      isFetching: true,
      status: {
        id: 0,
        code: "WAITING_FOR_APPROVAL",
        name: "",
      },
      createdAt: "",
    });
  }

  return reports;
};

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
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const pageSize = 10;

export const ReportManagementList: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Query
  const [fetchReport, { data, isFetching }] = useLazyFetchReportsQuery();

  // Scroll to top
  useScrollToTopOnLoad();

  // Clear previous cache
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reportsAPI.util.resetApiState());
  }, []);

  // Searchbox state
  const [searchboxValue, setSearchboxValue] = useState<string>("");

  const [termId, setTermId] = useState<number | null>();

  const [page, setPage] = useState<number>(1);

  // Is data empty (derived from data)
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>();

  useEffect(() => {
    setIsDataEmpty(!isFetching && data && data.data && data.data.length === 0);
  }, [data]);

  // Fetch plan on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const paramters: ListReportParameters = {
        query: searchboxValue,
        page,
        pageSize,
      };

      if (termId) {
        paramters.termId = termId;
      }

      fetchReport(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page, termId]);

  // Mark as reviewed
  const [markAsReviewed, { isSuccess }] = useMarkAsReviewedMutation();

  // Mark as reviewed handler: update cache
  const markAsReviewedHandler = useCallback(
    (reportId?: number) => {
      // Call API
      reportId && markAsReviewed({ reportId });

      reportsAPI.util.updateQueryData(
        "fetchReports",
        { query: searchboxValue, termId, page, pageSize },
        (draft) => {
          draft.data.forEach((report, index) => {
            if (report.reportId === reportId) {
              draft.data[index].status.code = "REVIEWED";
              draft.data[index].status.name = "Reviewed";
            }
          });
        }
      );
    },
    [markAsReviewed]
  );

  // Mark as reviewed success
  const isDarkmode = useDetectDarkmode();

  useEffect(() => {
    if (isSuccess) {
      toast("Mark as reviewed successfully!", {
        type: "success",
        theme: isDarkmode ? "dark" : "light",
      });
    }
  }, [isSuccess]);

  return (
    <motion.div
      className="px-6 pb-20"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      {/* Banner */}
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto">
          <p className="text-primary dark:text-primary/70 font-extrabold text-xl w-fit ml-7">
            Report management
          </p>
        </div>
      </BubbleBanner>

      <motion.div variants={childrenAnimation}>
        <ListReportFilter
          searchboxValue={searchboxValue}
          onSearchboxChange={(value) => {
            setSearchboxValue(value);
          }}
          onTermIdChange={(termId) => {
            setTermId(termId);
          }}
        />
      </motion.div>

      <motion.div variants={childrenAnimation}>
        <TableReportManagement
          reports={isFetching ? generateEmptyReports(10) : data?.data}
          isDataEmpty={isDataEmpty}
          page={page}
          totalPage={data?.pagination.numPages}
          onMarkAsReviewed={markAsReviewedHandler}
          onNext={() =>
            setPage((prevPage) => {
              if (data?.pagination.numPages) {
                if (prevPage + 1 > data?.pagination.numPages) {
                  return data?.pagination.numPages;
                } else {
                  return prevPage + 1;
                }
              } else {
                return 1;
              }
            })
          }
          onPageChange={(page) => {
            setPage(page || 1);
          }}
          onPrevious={() =>
            setPage((prevPage) => {
              if (data?.pagination.numPages) {
                if (prevPage === 1) {
                  return 1;
                } else {
                  return prevPage - 1;
                }
              } else {
                return 1;
              }
            })
          }
          isFetching={isFetching}
        />
      </motion.div>
    </motion.div>
  );
};
