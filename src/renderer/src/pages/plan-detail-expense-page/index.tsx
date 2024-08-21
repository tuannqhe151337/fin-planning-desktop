import { useEffect, useState } from "react";
import { Variants, motion } from "framer-motion";
import { TablePlanExpenses } from "../../widgets/table-plan-expense";
import { ListPlanDetailFilter } from "../../widgets/list-plan-detail-filter";
import {
  ListPlanExpenseParameters,
  useLazyFetchPlanExpensesQuery,
} from "../../providers/store/api/plansApi";
import { useParams } from "react-router-dom";
import {
  AFFIX,
  Expense,
  LocalStorageItemKey,
} from "../../providers/store/api/type";
import { usePlanDetailContext } from "../plan-detail-root-page";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { useIsAuthorizedToReupload } from "../../features/use-is-authorized-to-reupload";

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

interface Row extends Expense {
  isFetching?: boolean;
}

const generateEmptyPlanExpenses = (total: number): Row[] => {
  const planExpenses: Row[] = [];

  for (let i = 0; i < total; i++) {
    planExpenses.push({
      expenseId: i,
      name: "",
      costType: {
        costTypeId: 0,
        name: "",
      },
      status: {
        statusId: 0,
        code: "APPROVED",
        name: "Approved",
      },
      unitPrice: 0,
      amount: 0,
      project: {
        projectId: 0,
        name: "",
      },
      supplier: {
        supplierId: 0,
        name: "",
      },
      pic: {
        picId: 0,
        name: "",
      },
      currency: {
        currencyId: 0,
        name: "",
        affix: AFFIX.PREFIX,
        symbol: "",
      },
      notes: "",
      isFetching: true,
    });
  }

  return planExpenses;
};

const pageSize = 10;

export const PlanDetailExpensePage: React.FC = () => {
  // Get show upload modal method
  const { plan, setShowReuploadModal } = usePlanDetailContext();

  // Currency
  const [currencyId, setCurrencyId] = useState<number>();

  // Get params
  const { planId } = useParams<{ planId: string }>();

  // Query
  const [fetchPlanExpense, { data, isFetching }] =
    useLazyFetchPlanExpensesQuery();

  // Selectable row
  const [listSelectedId, setListSelectedId] = useState<Set<number>>(new Set());
  const [showReviewExpense, setShowReviewExpense] = useState<boolean>(false);
  useEffect(() => {
    if (listSelectedId.size !== 0) {
      setShowReviewExpense(true);
    } else {
      setShowReviewExpense(false);
    }
  }, [listSelectedId]);

  // Searchbox state
  const [searchboxValue, setSearchboxValue] = useState<string>("");
  const [costTypeId, setCostTypeId] = useState<number | null>();
  const [statusId, setStatusId] = useState<number | null>();
  const [page, setPage] = useState<number>(1);

  // Is data empty (derived from data)
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>();

  useEffect(() => {
    setIsDataEmpty(!isFetching && data && data.data && data.data.length === 0);
  }, [data]);

  // Fetch report expense on change
  useEffect(() => {
    if (planId) {
      const timeoutId = setTimeout(() => {
        const paramters: ListPlanExpenseParameters = {
          planId: parseInt(planId),
          query: searchboxValue,
          page,
          pageSize,
        };

        if (currencyId) {
          paramters.currencyId = currencyId;
        }

        if (costTypeId) {
          paramters.costTypeId = costTypeId;
        }

        if (statusId) {
          paramters.statusId = statusId;
        }
        fetchPlanExpense(paramters, true);
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [searchboxValue, page, costTypeId, statusId, planId, currencyId]);

  // Authorized to show reupload button
  const isAuthorizedToReupload = useIsAuthorizedToReupload({
    planDepartmentId: plan?.department.departmentId,
    planTermStartDate: plan?.term.startDate,
    planTermEndDate: plan?.term.endDate,
    planTermReuploadStartDate: plan?.term.reuploadStartDate,
    planTermReuploadEndDate: plan?.term.reuploadEndDate,
  });

  return (
    <motion.div
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <ListPlanDetailFilter
        className="pl-3 mt-7"
        currencyId={currencyId}
        showReviewExpense={showReviewExpense}
        searchboxValue={searchboxValue}
        onSearchboxChange={(value) => {
          setSearchboxValue(value);
        }}
        onCostTypeIdChange={(costTypeId) => {
          setCostTypeId(costTypeId);
        }}
        onStatusIdChange={(statusId) => {
          setStatusId(statusId);
        }}
        onCurrencyChoose={(currency) => {
          setCurrencyId(currency?.currencyId);
        }}
        showReupload={isAuthorizedToReupload}
        onDownloadClick={() => {
          const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

          if (token && plan && planId) {
            downloadFileFromServer(
              `${
                import.meta.env.VITE_BACKEND_HOST
              }plan/download/last-version-xlsx?planId=${planId}`,
              token,
              `${plan.name}-v${plan.version}.xlsx`,
            );
          }
        }}
        onReuploadClick={() => {
          setShowReuploadModal(true);
        }}
      />

      <TablePlanExpenses
        expenses={isFetching ? generateEmptyPlanExpenses(10) : data?.data}
        isDataEmpty={isDataEmpty}
        page={page}
        totalPage={data?.pagination.numPages}
        onNext={() => {
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
          });

          // Reset selected index
          setListSelectedId(new Set());
        }}
        onPageChange={(page) => {
          setPage(page || 1);

          // Reset selected index
          setListSelectedId(new Set());
        }}
        onPrevious={() => {
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
          });

          // Reset selected index
          setListSelectedId(new Set());
        }}
        isFetching={isFetching}
      />
    </motion.div>
  );
};
