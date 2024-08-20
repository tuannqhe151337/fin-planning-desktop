import { FaPlusCircle } from "react-icons/fa";
import { IconButton } from "../../shared/icon-button";
import { Pagination } from "../../shared/pagination";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { DeletePlanModal } from "../delete-plan-modal";
import { PlanPreview } from "../../providers/store/api/plansApi";
import { useMeQuery } from "../../providers/store/api/authApi";
import { useHotkeys } from "react-hotkeys-hook";
import { PlanActionContextMenu } from "../../entities/plan-action-context-menu";
import { ReuploadPlanModal } from "../reupload-plan-modal";
import { Skeleton } from "../../shared/skeleton";
import { LocalStorageItemKey, Role } from "../../providers/store/api/type";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { useIsAuthorizedToReupload } from "../../features/use-is-authorized-to-reupload";
import { TermPreviewer } from "../../entities/term-previewer";
import { PlanPreviewer } from "../../entities/plan-previewer";
import { useIsAuthorizedToReuploadFn } from "../../features/use-is-authorized-to-reupload-fn";
import { ReloadCloudIcon } from "../../shared/icons/reload-cloud-icon";

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

const rowAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

export interface Row extends PlanPreview {
  isFetching?: boolean;
}

interface Props {
  onCreatePlanClick?: () => any;
  isFetching?: boolean;
  plans?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onDeleteSuccessfully?: (plan: PlanPreview) => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TablePlanManagement: React.FC<Props> = ({
  onCreatePlanClick,
  plans,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onDeleteSuccessfully,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // Navigation
  const navigate = useNavigate();

  // Get me's data
  const { data: me } = useMeQuery();

  // Chosen plan's id
  const [chosenPlan, setChosenPlan] = useState<PlanPreview>();

  // Should show reupload plan (authorization)
  const isAuthorizedToReupload = useIsAuthorizedToReupload({
    planDepartmentId: chosenPlan?.department.departmentId,
    planTermStartDate: chosenPlan?.term.startDate,
    planTermEndDate: chosenPlan?.term.endDate,
    planTermReuploadStartDate: chosenPlan?.term.reuploadStartDate,
    planTermReuploadEndDate: chosenPlan?.term.reuploadEndDate,
  });
  const isAuthorizedToReuploadFn = useIsAuthorizedToReuploadFn();

  // UI: show delete button
  const [hoverRowIndex, setHoverRowIndex] = useState<number>();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showReuploadPlan, setShowReuploadPlan] = useState<boolean>(false);

  const handleDeletePlanModal = () => {
    setShowDeleteModal(false);
  };

  // UI: context menu
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuTop, setContextMenuTop] = useState<number>(0);
  const [contextMenuLeft, setContextMenuLeft] = useState<number>(0);

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
    <div className="pb-24">
      <table className="text-center text-sm font-light mt-6 min-w-full shadow rounded-lg">
        <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600 rounded-lg">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80 rounded-tl-lg"
            >
              Plan
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              Term
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              Department
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              Version
            </th>
            <th scope="col" className="rounded-tr-lg">
              <IconButton
                className="px-3"
                tooltip="Upload new plan"
                onClick={() => {
                  onCreatePlanClick && onCreatePlanClick();
                }}
              >
                <FaPlusCircle className="text-[21px] text-primary-500/60 hover:text-primary-500/80 my-0.5" />
              </IconButton>
            </th>
          </tr>
        </thead>
        <tbody>
          {plans &&
            plans.map((plan, index) => (
              <motion.tr
                key={index}
                variants={rowAnimation}
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
                className={clsx({
                  "group text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-400 cursor-pointer duration-200":
                    true,
                  "bg-white hover:bg-primary-50/50 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/70":
                    index % 2 === 0,
                  "bg-primary-50 hover:bg-primary-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-800":
                    index % 2 === 1,
                })}
                onMouseEnter={() => {
                  setHoverRowIndex(index);
                }}
                onMouseLeave={() => {
                  setHoverRowIndex(undefined);
                }}
                onClick={() => {
                  navigate(`detail/expenses/${plan.planId}`);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowContextMenu(true);
                  setContextMenuLeft(e.pageX);
                  setContextMenuTop(e.pageY);
                  setChosenPlan(plan);
                }}
              >
                <td
                  className={clsx({
                    "whitespace-nowrap px-6 py-5 font-extrabold": true,
                    "rounded-bl-lg": index === plans.length - 1,
                  })}
                >
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <PlanPreviewer planId={plan.planId}>
                      <div className="group-hover:underline">{plan.name}</div>
                    </PlanPreviewer>
                  )}
                </td>
                <td
                  className="whitespace-nowrap px-6 py-5 font-bold"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <TermPreviewer termId={plan.term.termId}>
                      {me?.role.code === Role.ACCOUNTANT ? (
                        <Link
                          to={`/term-management/detail/information/${plan.term.termId}`}
                          className="hover:text-sky-600 dark:hover:text-sky-600 hover:underline duration-200"
                        >
                          {plan.term.name}
                        </Link>
                      ) : (
                        <>{plan.term.name}</>
                      )}
                    </TermPreviewer>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-5 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <div>{plan.department.name}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-5 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <>v{plan.version}</>
                  )}
                </td>
                <td
                  className={clsx({
                    "whitespace-nowrap px-6 py-4": true,
                    "rounded-br-lg": index === plans.length - 1,
                  })}
                >
                  {!isFetching &&
                    isAuthorizedToReuploadFn({
                      planDepartmentId: plan.department.departmentId,
                      planTermStartDate: plan.term.startDate,
                      planTermEndDate: plan.term.endDate,
                      planTermReuploadStartDate: plan.term.reuploadStartDate,
                      planTermReuploadEndDate: plan.term.reuploadEndDate,
                    }) && (
                      <motion.div
                        initial={AnimationStage.HIDDEN}
                        animate={
                          hoverRowIndex === index
                            ? AnimationStage.VISIBLE
                            : AnimationStage.HIDDEN
                        }
                        exit={AnimationStage.HIDDEN}
                        variants={animation}
                      >
                        <IconButton
                          tooltip="Reupload plan"
                          onClick={(event) => {
                            event.stopPropagation();
                            setChosenPlan(plan);
                            setShowReuploadPlan(true);
                          }}
                        >
                          <ReloadCloudIcon className="w-[30px] fill-primary-600" />
                        </IconButton>
                      </motion.div>
                    )}
                </td>
              </motion.tr>
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

      {chosenPlan && (
        <DeletePlanModal
          plan={chosenPlan}
          show={showDeleteModal}
          onClose={handleDeletePlanModal}
          onDeleteSuccessfully={onDeleteSuccessfully}
        />
      )}

      {chosenPlan && (
        <ReuploadPlanModal
          planId={chosenPlan.planId}
          planName={chosenPlan.name}
          termName={chosenPlan.term.name}
          show={showReuploadPlan}
          onClose={() => {
            setShowReuploadPlan(false);
          }}
        />
      )}

      {chosenPlan && (
        <PlanActionContextMenu
          show={showContextMenu}
          top={contextMenuTop}
          left={contextMenuLeft}
          showDeletePlan={
            chosenPlan.department.departmentId === me?.department.id
          }
          showReuploadPlan={isAuthorizedToReupload}
          onDeletePlan={() => {
            setShowDeleteModal(true);
          }}
          onReuploadPlan={() => {
            setShowReuploadPlan(true);
          }}
          onUploadPlan={onCreatePlanClick}
          onViewPlanDetail={() => {
            navigate(`/plan-management/detail/expenses/${chosenPlan.planId}`);
          }}
          onDownloadPlan={() => {
            const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

            if (token) {
              downloadFileFromServer(
                `${
                  import.meta.env.VITE_BACKEND_HOST
                }plan/download/last-version-xlsx?planId=${chosenPlan.planId}`,
                token,
                `${chosenPlan.name}.xlsx`
              );
            }
          }}
        />
      )}
    </div>
  );
};
