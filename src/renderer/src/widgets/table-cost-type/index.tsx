import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { IconButton } from "../../shared/icon-button";
import { Pagination } from "../../shared/pagination";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { CostType } from "../../providers/store/api/costTypeAPI";
import { Skeleton } from "../../shared/skeleton";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import { CostTypeActionContextMenu } from "../../entities/cost-type-action-context-menu";
import { AiFillEdit } from "react-icons/ai";
import { useHotkeys } from "react-hotkeys-hook";

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

export interface Row extends CostType {
  isFetching?: boolean;
}

interface Props {
  isFetching?: boolean;
  costTypes?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onCreateCostType?: () => any;
  onDeleteCostType?: (CostType: CostType) => any;
  onEditCostType?: (CostType: CostType) => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TableCostType: React.FC<Props> = ({
  costTypes,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onCreateCostType,
  onDeleteCostType,
  onEditCostType,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // UI: show delete button
  const [hoverRowIndex, setHoverRowIndex] = useState<number>();

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

  // Chosen CostType
  const [chosenCostType, setChosenCostType] = useState<CostType>();

  return (
    <div>
      <table className="text-center text-sm font-light mt-6 min-w-full shadow overflow-hidden rounded-lg">
        <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              No.
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-left text-primary-500/80 dark:text-primary-600/80"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              Created at
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              Updated at
            </th>
            <th scope="col">
              <IconButton
                className="px-3"
                tooltip="Add new cost type"
                onClick={() => {
                  onCreateCostType && onCreateCostType();
                }}
              >
                <FaPlusCircle className="text-[21px] text-primary-500/60 hover:text-primary-500/80 my-0.5" />
              </IconButton>
            </th>
          </tr>
        </thead>
        <tbody>
          {costTypes &&
            costTypes.map((costType, index) => (
              <motion.tr
                key={index}
                variants={rowAnimation}
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
                className={clsx({
                  "group text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-400 duration-200":
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
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowContextMenu(true);
                  setContextMenuLeft(e.pageX);
                  setContextMenuTop(e.pageY);
                  setChosenCostType(costType);
                }}
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium text-center w-[100px]">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <p className="font-extrabold py-2 duration-200">
                      {index + 1}
                    </p>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <p className="font-extrabold py-2 text-left duration-200">
                      {costType.name}
                    </p>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-bold w-[250px]">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <div>{formatISODateFromResponse(costType.createdAt)}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-bold w-[250px]">
                  {isFetching ? (
                    <Skeleton className="w-[100px]" />
                  ) : (
                    <div>{formatISODateFromResponse(costType.updatedAt)}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 w-[100px]">
                  {!isFetching && (
                    <motion.div
                      className="flex flex-row flex-wrap items-center justify-center gap-2 w-max m-auto"
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
                        tooltip="Edit cost type"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditCostType && onEditCostType(costType);
                        }}
                      >
                        <AiFillEdit className="text-primary-600 text-2xl" />
                      </IconButton>
                      <IconButton
                        tooltip="Delete cost type"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteCostType && onDeleteCostType(costType);
                        }}
                      >
                        <FaTrash className="text-red-600 text-xl" />
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

      <CostTypeActionContextMenu
        show={showContextMenu}
        left={contextMenuLeft}
        top={contextMenuTop}
        onCreateCostType={() => {
          onCreateCostType && onCreateCostType();
        }}
        onEditCostType={() => {
          chosenCostType && onEditCostType && onEditCostType(chosenCostType);
        }}
        onDeleteCostType={() => {
          chosenCostType &&
            onDeleteCostType &&
            onDeleteCostType(chosenCostType);
        }}
      />
    </div>
  );
};
