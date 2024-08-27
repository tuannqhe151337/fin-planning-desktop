import { useEffect, useMemo, useState } from "react";
import { Variants, motion } from "framer-motion";
import { produce } from "immer";
import { SearchBox } from "../../shared/search-box";
import { Pagination } from "../../shared/pagination";
import { TermList } from "./component/term-list";
import {
  ListTermWhenCreatePlanParameters,
  termAPI,
  TermCreatePlan,
  useLazyGetListTermWhenCreatePlanQuery,
} from "../../providers/store/api/termApi";
import { useWindowHeight } from "../../shared/utils/use-window-height";
import { useDispatch } from "react-redux";

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
  [AnimationStage.HIDDEN]: {
    opacity: 0.2,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

interface Props {
  hide?: boolean;
  onTermSelected: (term: TermCreatePlan) => any;
}

export const ChooseTermStage: React.FC<Props> = ({ hide, onTermSelected }) => {
  // Remove cache each time show this stage
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hide) {
      dispatch(termAPI.util.resetApiState());
    }
  }, [hide]);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Searchbox
  const [searchboxValue, setSearchboxValue] = useState<string>("");

  // Mutation
  const [getListTermWhenCreatePlan, { data, isFetching, isSuccess }] =
    useLazyGetListTermWhenCreatePlanQuery();

  // Fetch list term on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const paramters: ListTermWhenCreatePlanParameters = {
        query: searchboxValue,
        page,
        pageSize,
      };

      getListTermWhenCreatePlan(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page, hide]);

  // Calculate optimal height for select term
  const windowHeight = useWindowHeight();

  const termListHeight = useMemo(() => {
    return windowHeight - 350;
  }, [windowHeight]);

  useEffect(() => {
    // py-6: 24px
    // gap-3: 12px
    // term item height: 55px
    setPageSize(Math.floor((termListHeight - 24 * 2 + 12) / (55 + 12)));
  }, [termListHeight]);

  return (
    <motion.div
      className="pt-6"
      initial={AnimationStage.HIDDEN}
      animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <motion.div variants={childrenAnimation}>
        <SearchBox
          autoFocus
          value={searchboxValue}
          onChange={(e) => {
            setSearchboxValue(e.currentTarget.value);
          }}
        />
      </motion.div>

      <motion.div variants={childrenAnimation}>
        <TermList
          hide={hide}
          isFetching={isFetching}
          height={termListHeight}
          isEmpty={isSuccess && data?.pagination.totalRecords === 0}
          terms={data?.data || []}
          onClick={(term) => {
            onTermSelected && onTermSelected(term);
          }}
        />
      </motion.div>

      <motion.div className="mt-auto" variants={childrenAnimation}>
        <Pagination
          page={page}
          totalPage={data?.pagination.numPages || 1}
          onPageChange={(page) => {
            page ? setPage(page) : setPage(1);
          }}
          onPrevious={() => {
            setPage(
              produce((page) => {
                if (page === null || page === undefined) {
                  return data?.pagination.numPages;
                } else if (page > 1) {
                  return page - 1;
                }
              })
            );
          }}
          onNext={() => {
            setPage(
              produce((page) => {
                if (
                  page === null ||
                  page === undefined ||
                  !data?.pagination.numPages
                ) {
                  return 1;
                } else if (page < data?.pagination.numPages) {
                  return page + 1;
                }
              })
            );
          }}
        />
      </motion.div>
    </motion.div>
  );
};
