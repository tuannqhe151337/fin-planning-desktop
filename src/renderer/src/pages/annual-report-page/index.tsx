import { useEffect, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { UploadPlanModal } from "../../widgets/upload-plan-modal";
import { Variants, motion } from "framer-motion";
import { Row, TableAnnualReport } from "../../widgets/table-annual-report";
import { YearFilter } from "../../entities/year-filter";
import {
  ListAnnualReportParameters,
  useLazyFetchAnnualQuery,
} from "../../providers/store/api/annualsAPI";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";

const generateEmptyAnnual = (total: number): Row[] => {
  const annual: Row[] = [];

  for (let i = 0; i < total; i++) {
    annual.push({
      annualReportId: 0,
      name: "",
      totalTerm: 0,
      totalExpense: 0,
      totalDepartment: 0,
      createdAt: "",
      isFetching: true,
    });
  }

  return annual;
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

export const AnnualReportList: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT, Role.FINANCIAL_STAFF]);

  // UI: reupload modal
  const [showUploadPlanModal, setShowUploadPlanModal] =
    useState<boolean>(false);

  // i18n
  const { t } = useTranslation(["sidebar"]);

  // Scroll to top
  useScrollToTopOnLoad();

  // Query
  const [fetchAnnual, { data, isFetching }] = useLazyFetchAnnualQuery();

  const [page, setPage] = useState<number>(1);

  // Is data empty (derived from data)
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>();

  useEffect(() => {
    setIsDataEmpty(!isFetching && data && data.data && data.data.length === 0);
  }, [data]);

  // Fetch plan on change
  useEffect(() => {
    fetchAnnual({ page: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const paramters: ListAnnualReportParameters = {
        page,
        pageSize: 10,
      };

      fetchAnnual(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [page]);

  return (
    <motion.div
      className="px-6 pb-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      {/* Banner */}
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto">
          <p className="text-primary dark:text-primary/70 font-extrabold text-xl w-fit ml-7">
            {t("Annual Report")}
          </p>
        </div>
      </BubbleBanner>

      <motion.div
        variants={childrenAnimation}
        className="mt-6 flex justify-end"
      >
        <YearFilter />
      </motion.div>

      <motion.div variants={childrenAnimation}>
        <TableAnnualReport
          onCreatePlanClick={() => {
            setShowUploadPlanModal(true);
          }}
          annual={isFetching ? generateEmptyAnnual(10) : data?.data}
          isDataEmpty={isDataEmpty}
          page={page}
          totalPage={data?.pagination.numPages}
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

      <UploadPlanModal
        show={showUploadPlanModal}
        onClose={() => {
          setShowUploadPlanModal(false);
        }}
      />
    </motion.div>
  );
};
