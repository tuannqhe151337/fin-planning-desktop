import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { IconButton } from "../../shared/icon-button";
import { Pagination } from "../../shared/pagination";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { Skeleton } from "../../shared/skeleton";
import { CurrencyActionContextMenu } from "../../entities/currency-action-context-menu";
import { AiFillEdit } from "react-icons/ai";
import { useHotkeys } from "react-hotkeys-hook";
import { CurrencyEditModal } from "../currency-edit-modal";
import { DeleteCurrencyModal } from "../delete-currency-modal";
import { Currency } from "../../providers/store/api/currencyApi";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import { Tag } from "../../shared/tag";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const tableAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

const deleteIconAnimation: Variants = {
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

export interface Row extends Currency {
  isFetching?: boolean;
}

interface Props {
  isFetching?: boolean;
  currencies?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onCreateCurrency?: () => any;
  onDeleteCurrency?: (Currency: Currency) => any;
  onEditCurrency?: (Currency: Currency) => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TableCurrency: React.FC<Props> = ({
  currencies,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onCreateCurrency,
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

  // Chosen currency
  const [chosenCurrency, setChosenCurrency] = useState<Currency>();

  // Currency delete modal
  const [showDeleteCurrencyModal, setShowDeleteCurrencyModal] =
    useState<boolean>(false);

  // Currency edit modal
  const [showEditCurrencyModal, setShowEditCurrencyModal] =
    useState<boolean>(false);

  return (
    <motion.div
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={tableAnimation}
    >
      <table className="text-center text-sm font-light mt-6 min-w-full shadow overflow-hidden rounded-lg">
        <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              ID
            </th>
            <th
              scope="col"
              className="pl-12 pr-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              <p className="text-left">Name</p>
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
                tooltip="Add new currency"
                onClick={() => {
                  onCreateCurrency && onCreateCurrency();
                }}
              >
                <FaPlusCircle className="text-[21px] text-primary-500/60 hover:text-primary-500/80 my-0.5" />
              </IconButton>
            </th>
          </tr>
        </thead>
        <tbody>
          {currencies?.map((currency, index) => (
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
                setChosenCurrency(currency);
              }}
            >
              <td className="whitespace-nowrap px-6 py-4 font-medium text-center w-[100px]">
                {isFetching ? (
                  <Skeleton className="w-[100px]" />
                ) : (
                  <p className="font-extrabold py-2 duration-200">
                    {currency.currencyId}
                  </p>
                )}
              </td>
              <td className="whitespace-nowrap pl-12 pr-6 py-4 font-medium">
                {isFetching ? (
                  <Skeleton className="w-[200px]" />
                ) : (
                  <div className="flex flex-row flex-wrap items-center gap-4">
                    <p className="font-extrabold py-2 duration-200">
                      {currency.name} ({currency.symbol}){" "}
                    </p>
                    {currency.default && (
                      <Tag background="filled" variant="inProgress">
                        Base currency
                      </Tag>
                    )}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-bold w-[250px]">
                {isFetching ? (
                  <Skeleton className="w-[100px]" />
                ) : (
                  <div>{formatISODateFromResponse(currency.createdAt)}</div>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-bold w-[250px]">
                {isFetching ? (
                  <Skeleton className="w-[100px]" />
                ) : (
                  <div>{formatISODateFromResponse(currency.updatedAt)}</div>
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
                    variants={deleteIconAnimation}
                  >
                    <IconButton
                      tooltip="Edit Currency"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowEditCurrencyModal(true);
                        setChosenCurrency(currency);
                      }}
                    >
                      <AiFillEdit className="text-primary-600 text-2xl" />
                    </IconButton>
                    {!currency.default && (
                      <IconButton
                        tooltip="Delete Currency"
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowDeleteCurrencyModal(true);
                          setChosenCurrency(currency);
                        }}
                      >
                        <FaTrash className="text-red-600 text-xl" />
                      </IconButton>
                    )}
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
          variants={tableAnimation}
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

      {chosenCurrency && (
        <CurrencyEditModal
          currency={chosenCurrency}
          show={showEditCurrencyModal}
          onClose={() => {
            setShowEditCurrencyModal(false);
          }}
          onEditSuccessfully={() => {
            setShowEditCurrencyModal(false);
          }}
        />
      )}

      {chosenCurrency && (
        <DeleteCurrencyModal
          currency={chosenCurrency}
          show={showDeleteCurrencyModal}
          onClose={() => {
            setShowDeleteCurrencyModal(false);
          }}
        />
      )}

      <CurrencyActionContextMenu
        show={showContextMenu}
        left={contextMenuLeft}
        top={contextMenuTop}
        onCreateCurrency={() => {
          onCreateCurrency && onCreateCurrency();
        }}
        onEditCurrency={() => {
          chosenCurrency && setShowEditCurrencyModal(true);
        }}
        onDeleteCurrency={() => {
          chosenCurrency && chosenCurrency && setShowDeleteCurrencyModal(true);
        }}
      />
    </motion.div>
  );
};
