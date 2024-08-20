import { useEffect, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { Variants, motion } from "framer-motion";
import _ from "lodash";
import { Row, TablePosition } from "../../widgets/table-position";
import { SearchBox } from "../../shared/search-box";
import { FaPlusCircle } from "react-icons/fa";
import {
  Position,
  ListPositionParameters,
  useLazyGetListPositionQuery,
  positionAPI,
} from "../../providers/store/api/positionApi";
import { DeletePositionModal } from "../../widgets/delete-position-modal";
import { PositionCreateModal } from "../../widgets/position-create-modal";
import { PositionEditModal } from "../../widgets/position-edit-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { useDispatch } from "react-redux";

const generateEmptyPositions = (total: number): Position[] => {
  const positions: Row[] = [];

  for (let i = 0; i < total; i++) {
    positions.push({
      id: 0,
      name: "",
      createdAt: "",
      updatedAt: "",
      isFetching: true,
    });
  }

  return positions;
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

export const PositionManagementList: React.FC = () => {
  // Query
  const [fetchPositions, { data, isFetching }] = useLazyGetListPositionQuery();

  // Scroll to top
  useScrollToTopOnLoad();

  // Clear previous cache
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(positionAPI.util.resetApiState());
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
      const paramters: ListPositionParameters = {
        query: searchboxValue,
        sortBy: "name",
        sortType: "asc",
        page,
        pageSize: 10,
      };

      fetchPositions(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page]);

  // Delete Position
  const [showDeletePositionModal, setShowDeletePositionModal] =
    useState<boolean>(false);

  const [chosenDeletePosition, setChosenDeletePosition] = useState<Position>();

  // Edit Position
  const [showEditPositionModal, setShowEditPositionModal] =
    useState<boolean>(false);

  const [chosenEditPosition, setChosenEditPosition] = useState<Position>();

  // Create Position
  const [showCreatePosition, setShowCreatePosition] = useState<boolean>(false);

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreatePosition(true);
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
            Position management
          </p>
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowCreatePosition(true);
              }}
            >
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                <FaPlusCircle className="text-xl" />
                <p className="text-sm font-semibold">New Position</p>
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
        <TablePosition
          onCreatePosition={() => {
            setShowCreatePosition(true);
          }}
          onDeletePosition={(position) => {
            setChosenDeletePosition(position);
            setShowDeletePositionModal(true);
          }}
          onEditPosition={(position) => {
            setChosenEditPosition(position);
            setShowEditPositionModal(true);
          }}
          positions={isFetching ? generateEmptyPositions(10) : data?.data}
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

      {chosenDeletePosition && (
        <DeletePositionModal
          show={showDeletePositionModal}
          position={chosenDeletePosition}
          onClose={() => {
            setShowDeletePositionModal(false);
          }}
          onDeleteSuccessfully={() => {
            setShowDeletePositionModal(false);
          }}
        />
      )}

      {chosenEditPosition && (
        <PositionEditModal
          show={showEditPositionModal}
          position={chosenEditPosition}
          onClose={() => {
            setShowEditPositionModal(false);
          }}
          onUpdateSuccessfully={() => {
            setShowEditPositionModal(false);
          }}
        />
      )}

      <PositionCreateModal
        show={showCreatePosition}
        onClose={() => {
          setShowCreatePosition(false);
        }}
        onCreateSuccessfully={() => {
          setShowCreatePosition(false);
        }}
      />
    </motion.div>
  );
};
