import { AnimatePresence, Variants, motion } from "framer-motion";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Tag } from "../../shared/tag";
import { FaMoneyBillTrendUp, FaCoins } from "react-icons/fa6";
import TabList from "../../shared/tab-list";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  PlanDetail,
  useGetPlanDetailQuery,
} from "../../providers/store/api/plansApi";
import { Skeleton } from "../../shared/skeleton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { OverviewCard } from "../../entities/overview-card";
import { Button } from "../../shared/button";
import { FaDownload, FaUpload } from "react-icons/fa";
import { ReuploadPlanModal } from "../../widgets/reupload-plan-modal";
import { useIsAuthorizedToReupload } from "../../features/use-is-authorized-to-reupload";
import {
  AFFIX,
  LocalStorageItemKey,
  Role,
} from "../../providers/store/api/type";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { NumericFormat } from "react-number-format";

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

type TabId = "expenses" | "detail" | "version";

type ContextType = {
  setShowReuploadModal: Dispatch<SetStateAction<boolean>>;
  showReuploadButton: boolean;
  plan?: PlanDetail;
};

export const PlanDetailRootPage: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT, Role.FINANCIAL_STAFF]);

  // Location
  const location = useLocation();

  // Navigation
  const navigate = useNavigate();

  // Parameters
  const { planId } = useParams<{ planId: string }>();

  // Modal
  const [showReuploadModal, setShowReuploadModal] = useState<boolean>(false);

  // Query
  const {
    data: plan,
    isError,
    isFetching,
    isSuccess,
  } = useGetPlanDetailQuery({
    planId: planId ? parseInt(planId, 10) : 0,
  });

  // Tablist state
  const [selectedTabId, setSelectedTabId] = useState<TabId>("expenses");

  useEffect(() => {
    const currentTabUrl = location.pathname
      .replace("/plan-management/detail/", "")
      .split("/")[0];

    switch (currentTabUrl) {
      case "expenses":
        setSelectedTabId("expenses");
        break;

      case "information":
        setSelectedTabId("detail");
        break;

      case "version":
        setSelectedTabId("version");
        break;
    }
  }, [location]);

  // Show reupload button: check the department of user is the same with plan, the plan is not closed yet, and not pass the due date
  const isAuthorizedToReupload = useIsAuthorizedToReupload({
    planDepartmentId: plan?.department.departmentId,
    planTermStartDate: plan?.term.startDate,
    planTermEndDate: plan?.term.endDate,
    planTermReuploadStartDate: plan?.term.reuploadStartDate,
    planTermReuploadEndDate: plan?.term.reuploadEndDate,
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
              to={`/plan-management`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              Plan management
            </Link>
            <span className="ml-3 text-base opacity-40">&gt;</span>
            <span>Plan detail</span>
          </p>

          {/* Right */}
          <div className="ml-auto">
            <Button
              variant={isAuthorizedToReupload ? "tertiary" : "primary"}
              onClick={() => {
                const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

                if (token && plan && planId) {
                  downloadFileFromServer(
                    `${
                      import.meta.env.VITE_BACKEND_HOST
                    }plan/download/last-version-xlsx?planId=${planId}`,
                    token,
                    `${plan.name}-${plan.version}.xlsx`,
                  );
                }
              }}
            >
              <div className="flex flex-row flex-wrap gap-3">
                <FaDownload />
                <p className="text-sm font-bold">Download plan</p>
              </div>
            </Button>
            {isAuthorizedToReupload && (
              <Button
                containerClassName="ml-3"
                onClick={() => {
                  setShowReuploadModal(true);
                }}
              >
                <div className="flex flex-row flex-wrap gap-3 ">
                  <FaUpload className="mt-0.5" />
                  <p className="text-sm font-semibold">Reupload plan</p>
                </div>
              </Button>
            )}
          </div>
        </div>
      </BubbleBanner>

      {/* Title */}
      <motion.div className="mt-6 px-7" variants={childrenAnimation}>
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
                  {plan?.name}
                </p>

                <div className="flex flex-row flex-wrap items-center justify-center gap-3">
                  <Tag background="unfilled" variant="waiting">
                    v{plan?.version}
                  </Tag>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-between gap-5 mt-10 px-5 w-full">
        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<RiCalendarScheduleFill className="text-4xl" />}
            label={"Term"}
            isFetching={isFetching}
            value={plan?.term.name}
            meteors
          />
        </motion.div>

        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<FaCoins className="text-4xl" />}
            label={"Expected cost"}
            isFetching={isFetching}
            value={
              <NumericFormat
                displayType="text"
                value={plan?.expectedCost.cost}
                decimalScale={2}
                prefix={
                  plan?.expectedCost.currency.affix === AFFIX.PREFIX
                    ? ` ${plan?.expectedCost.currency.name}`
                    : undefined
                }
                suffix={
                  plan?.expectedCost.currency.affix === AFFIX.SUFFIX
                    ? ` ${plan?.expectedCost.currency.name}`
                    : undefined
                }
                thousandSeparator
              />
            }
          />
        </motion.div>

        <motion.div className="flex-1" variants={childrenAnimation}>
          <OverviewCard
            icon={<FaMoneyBillTrendUp className="text-4xl" />}
            label={"Actual cost"}
            isFetching={isFetching}
            value={
              <NumericFormat
                displayType="text"
                value={plan?.actualCost.cost}
                decimalScale={2}
                prefix={
                  plan?.actualCost.currency.affix === AFFIX.PREFIX
                    ? ` ${plan?.actualCost.currency.name}`
                    : undefined
                }
                suffix={
                  plan?.actualCost.currency.affix === AFFIX.SUFFIX
                    ? ` ${plan?.actualCost.currency.name}`
                    : undefined
                }
                thousandSeparator
              />
            }
          />
        </motion.div>
      </div>

      <div className="mt-7 px-5">
        <div className="relative w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl py-7 px-8">
          <div className="border-b-2 border-b-neutral-200 dark:border-b-neutral-700">
            <TabList
              className="-mb-0.5"
              selectedItemId={selectedTabId}
              items={[
                { id: "expenses", name: "Expenses" },
                { id: "detail", name: "Detail" },
                { id: "version", name: "Version" },
              ]}
              onItemChangeHandler={({ id }) => {
                switch (id) {
                  case "expenses":
                    navigate(`./expenses/${planId}`);
                    break;

                  case "detail":
                    navigate(`./information/${planId}`);
                    break;

                  case "version":
                    navigate(`./version/${planId}`);
                    break;

                  default:
                    break;
                }
              }}
            />
          </div>

          <motion.div layout>
            <Outlet
              context={{ setShowReuploadModal, showReuploadModal, plan }}
            />
          </motion.div>
        </div>
      </div>

      <ReuploadPlanModal
        show={showReuploadModal}
        planId={plan?.id}
        planName={plan?.name}
        termName={plan?.term.name}
        onClose={() => {
          setShowReuploadModal(false);
        }}
      />
    </motion.div>
  );
};

export const usePlanDetailContext = () => {
  return useOutletContext<ContextType>();
};
