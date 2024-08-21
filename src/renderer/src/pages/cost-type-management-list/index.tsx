import { useEffect, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { Variants, motion } from "framer-motion";
import _ from "lodash";
import { Row, TableCostType } from "../../widgets/table-cost-type";
import { SearchBox } from "../../shared/search-box";
import { FaPlusCircle } from "react-icons/fa";
import {
  CostType,
  costTypeAPI,
  ListCostTypeParameters,
  useLazyGetListCostTypeQuery,
} from "../../providers/store/api/costTypeAPI";
import { DeleteCostTypeModal } from "../../widgets/delete-cost-type-modal";
import { CostTypeCreateModal } from "../../widgets/cost-type-create-modal";
import { CostTypeEditModal } from "../../widgets/cost-type-edit-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";
import { useDispatch } from "react-redux";

const generateEmptyCostTypes = (total: number): CostType[] => {
  const costTypes: Row[] = [];

  for (let i = 0; i < total; i++) {
    costTypes.push({
      costTypeId: 0,
      name: "",
      createdAt: "",
      updatedAt: "",
      isFetching: true,
    });
  }

  return costTypes;
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

export const CostTypeManagementList: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Query
  const [fetchCostTypes, { data, isFetching }] = useLazyGetListCostTypeQuery();

  // Scroll to top
  useScrollToTopOnLoad();

  // Clear previous cache
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(costTypeAPI.util.resetApiState());
  }, []);

  // Searchbox state
  const [searchboxValue, setSearchboxValue] = useState<string>("");

  const [page, setPage] = useState<number>(1);

  // Is data empty (derived from data)
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>();

  useEffect(() => {
    setIsDataEmpty(!isFetching && data && data.data && data.data.length === 0);
  }, [data]);

  // Fetch plan on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const paramters: ListCostTypeParameters = {
        query: searchboxValue,
        page,
        pageSize: 10,
      };

      fetchCostTypes(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page]);

  // Delete CostType
  const [showDeleteCostTypeModal, setShowDeleteCostTypeModal] =
    useState<boolean>(false);

  const [chosenDeleteCostType, setChosenDeleteCostType] = useState<CostType>();

  // Edit CostType
  const [showEditCostTypeModal, setShowEditCostTypeModal] =
    useState<boolean>(false);

  const [chosenEditCostType, setChosenEditCostType] = useState<CostType>();

  // Create CostType
  const [showCreateCostType, setShowCreateCostType] = useState<boolean>(false);

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreateCostType(true);
  });

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
            Cost type management
          </p>
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowCreateCostType(true);
              }}
            >
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                <FaPlusCircle className="text-xl" />
                <p className="text-sm font-semibold">New cost type</p>
              </div>
            </Button>
          </div>
        </div>
      </BubbleBanner>

      <motion.div className="mt-14" variants={childrenAnimation}>
        <SearchBox
          value={searchboxValue}
          onChange={(e) => setSearchboxValue(e.currentTarget.value)}
        />
      </motion.div>

      <motion.div variants={childrenAnimation}>
        <TableCostType
          onCreateCostType={() => {
            setShowCreateCostType(true);
          }}
          onDeleteCostType={(costType) => {
            setChosenDeleteCostType(costType);
            setShowDeleteCostTypeModal(true);
          }}
          onEditCostType={(costType) => {
            setChosenEditCostType(costType);
            setShowEditCostTypeModal(true);
          }}
          costTypes={isFetching ? generateEmptyCostTypes(10) : data?.data}
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

      {chosenDeleteCostType && (
        <DeleteCostTypeModal
          show={showDeleteCostTypeModal}
          costType={chosenDeleteCostType}
          onClose={() => {
            setShowDeleteCostTypeModal(false);
          }}
          onDeleteSuccessfully={() => {
            setShowDeleteCostTypeModal(false);
          }}
        />
      )}

      {chosenEditCostType && (
        <CostTypeEditModal
          show={showEditCostTypeModal}
          costType={chosenEditCostType}
          onClose={() => {
            setShowEditCostTypeModal(false);
          }}
          onUpdateSuccessfully={() => {
            setShowEditCostTypeModal(false);
          }}
        />
      )}

      <CostTypeCreateModal
        show={showCreateCostType}
        onClose={() => {
          setShowCreateCostType(false);
        }}
        onCreateSuccessfully={() => {
          setShowCreateCostType(false);
        }}
      />
    </motion.div>
  );
};
