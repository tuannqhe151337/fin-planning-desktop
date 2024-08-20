import { Variants, motion } from "framer-motion";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { BubbleBanner } from "../../entities/bubble-banner";
import { FaDownload, FaPiggyBank } from "react-icons/fa6";
import TabList from "../../shared/tab-list";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { PiTreeStructureFill } from "react-icons/pi";
import { Button } from "../../shared/button";
import { useLazyFetchAnnualReportDetailQuery } from "../../providers/store/api/annualsAPI";
import { useEffect, useState } from "react";
import { formatViMoney } from "../../shared/utils/format-vi-money";
import { OverviewCard } from "../../entities/overview-card";
import { useTranslation } from "react-i18next";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";
import { LocalStorageItemKey, Role } from "../../providers/store/api/type";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";

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

type TabId = "overview" | "detail";

export const AnnualReportDetailRootPage: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT, Role.FINANCIAL_STAFF]);

  // i18n
  const { t } = useTranslation(["annual-report-detail"]);

  // Location
  const location = useLocation();

  // Navigation
  const navigate = useNavigate();

  // Get annual report detail
  const { year } = useParams<{ year: string }>();

  const [fetchAnnualReportDetail, { data: annual, isFetching, isSuccess }] =
    useLazyFetchAnnualReportDetailQuery();

  useEffect(() => {
    if (year) {
      fetchAnnualReportDetail(parseInt(year, 10), true);
    }
  }, [year]);

  // Tablist state
  const [selectedTabId, setSelectedTabId] = useState<TabId>("detail");

  useEffect(() => {
    const currentTabUrl = location.pathname
      .replace("/annual-report/detail/", "")
      .split("/")[0];

    switch (currentTabUrl) {
      case "chart":
        setSelectedTabId("overview");
        break;

      case "table":
        setSelectedTabId("detail");
        break;
    }
  }, [location]);

  if (!isFetching && isSuccess && !annual) return <p>{t("No annual found")}</p>;

  return (
    <motion.div
      className="px-6 pb-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto">
          <p className="text-primary dark:text-primary/70 font-extrabold text-lg w-fit ml-7 space-x-2">
            <Link
              to={`/annual-report`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              {t("Annual Report")}
            </Link>
            <span className="ml-3 text-base opacity-40">&gt;</span>
            <span>
              {t("Report", {
                year: annual?.name,
              })}
            </span>
          </p>
          <div className="ml-auto">
            <Button
              onClick={() => {
                const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

                if (token && annual) {
                  downloadFileFromServer(
                    `${
                      import.meta.env.VITE_BACKEND_HOST
                    }annual-report/download-xlsx?annualReportId=${
                      annual.annualReportId
                    }`,
                    token,
                    `annual-report-${parseISOInResponse(
                      annual.createdAt
                    ).getFullYear()}.xlsx`
                  );
                }
              }}
            >
              <div className="flex flex-row flex-wrap items-center gap-2">
                <FaDownload className="text-xl mb-0.5" />
                <p className="text-sm font-bold">{t("Download report")}</p>
              </div>
            </Button>
          </div>
        </div>
      </BubbleBanner>

      {/* Title */}
      <motion.div
        className="flex flex-row flex-wrap items-center mt-6 px-7"
        variants={childrenAnimation}
      >
        <p className="text-2xl font-extrabold text-primary mr-5">
          {t("ReportYear", {
            year: annual?.name,
          })}
        </p>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-between gap-5 mt-10 px-5 w-full">
        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<RiCalendarScheduleFill className="text-4xl" />}
            label={t("Total terms")}
            isFetching={isFetching}
            value={annual?.totalTerm}
            meteors
          />
        </motion.div>

        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<PiTreeStructureFill className="text-4xl" />}
            label={t("Total departments")}
            isFetching={isFetching}
            value={annual?.totalDepartment}
          />
        </motion.div>

        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<FaPiggyBank className="text-4xl" />}
            label={t("Total expenses")}
            isFetching={isFetching}
            value={formatViMoney(annual?.totalExpense || 0)}
          />
        </motion.div>
      </div>

      <div className="mt-7 px-5">
        <div className="w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl py-7 px-8">
          <div className="border-b-2 border-b-neutral-200 dark:border-b-neutral-700">
            <TabList
              className="-mb-0.5"
              selectedItemId={selectedTabId}
              items={[
                { id: "overview", name: t("Overview") },
                { id: "detail", name: t("Detail") },
              ]}
              onItemChangeHandler={({ id }) => {
                switch (id) {
                  case "overview":
                    navigate(`./chart/${year}`);
                    break;

                  case "detail":
                    navigate(`./table/${year}`);
                    break;
                }
              }}
            />
          </div>

          <motion.div layout>
            <Outlet />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
