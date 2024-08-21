import { FaPlusCircle } from "react-icons/fa";
import { IconButton } from "../../shared/icon-button";
import { Pagination } from "../../shared/pagination";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa6";
import { Button } from "../../shared/button";
import { StartTermModal } from "../start-term-modal";
import clsx from "clsx";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import { Term } from "../../providers/store/api/termApi";
import { useHotkeys } from "react-hotkeys-hook";
import { TermActionContextMenu } from "../../entities/term-action-context-menu";
import { DeleteTermModal } from "../delete-term-modal";
import { Skeleton } from "../../shared/skeleton";
import { TermPreviewer } from "../../entities/term-previewer";
import { TermTag } from "../../entities/term-tag";
import { useTranslation } from "react-i18next";

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

export interface Row extends Term {
  isFetching?: boolean;
}

interface Props {
  onCreateTermClick?: () => any;
  isFetching?: boolean;
  terms?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onStartTermSuccessfully?: (termId: string | number) => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}
export const TableTermManagement: React.FC<Props> = ({
  onCreateTermClick,
  terms,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onStartTermSuccessfully,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // i18n
  const { t } = useTranslation(["term-management"]);

  // Navigation
  const navigate = useNavigate();

  // UI: show delete button
  const [hoverRowIndex, setHoverRowIndex] = useState<number>();
  const [startModal, setStartModal] = useState<boolean>(false);

  // UI: delete modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Start term's id state
  const [chosenTerm, setChosenTerm] = useState<Term>();

  const handleClick = () => {
    setStartModal(true);
  };

  const handleCloseStartTermModal = () => {
    setStartModal(false);
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
    <div className="pb-20">
      <table className="text-center text-sm font-light mt-6 min-w-full shadow rounded-lg">
        <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Term")}
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Start date")}
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
            >
              {t("End date")}
            </th>

            <th scope="col">
              <IconButton
                className="px-3"
                tooltip="Add new term"
                onClick={() => {
                  onCreateTermClick && onCreateTermClick();
                }}
              >
                <FaPlusCircle className="text-[21px] text-primary-500/60 hover:text-primary-500/80 my-0.5" />
              </IconButton>
            </th>
          </tr>
        </thead>
        <tbody>
          {terms &&
            terms.map((term, index) => (
              <tr
                key={index}
                className={clsx({
                  "group cursor-pointer border-b-2 border-neutral-100 dark:border-neutral-800 duration-200":
                    true,
                  "text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-400":
                    term.status.code !== "CLOSED",
                  "text-primary-500/70 hover:text-primary-500 dark:text-primary-800 dark:hover:text-primary-600":
                    term.status.code === "CLOSED",
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
                  navigate(`detail/information/${term.termId}`);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowContextMenu(true);
                  setContextMenuLeft(e.pageX);
                  setContextMenuTop(e.pageY);
                  setChosenTerm(term);
                }}
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium w-[360px]">
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <div className="flex flex-row flex-wrap w-max">
                      <TermPreviewer
                        termId={term.termId}
                        containerClassName="py-2 ml-14"
                      >
                        <p className="font-extrabold group-hover:underline">
                          {term.name}
                        </p>
                      </TermPreviewer>
                      <div>
                        <TermTag status={term.status.code} />
                      </div>
                    </div>
                  )}
                </td>

                <td className="whitespace-nowrap px-6 py-4 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <> {formatISODateFromResponse(term.startDate)}</>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-bold">
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <> {formatISODateFromResponse(term.endDate)}</>
                  )}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  {term.status.code === "NEW" && (
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
                      <Button
                        className="flex flex-row flex-wrap py-1 px-3"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClick();
                          setChosenTerm(term);
                        }}
                      >
                        <FaPlay className="text-white dark:text-neutral-300 text-base mr-2 mt-[1.25px]" />
                        <div className="text-white dark:text-neutral-300 text-sm font-bold">
                          {t("Start")}
                        </div>
                      </Button>
                    </motion.div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isDataEmpty && (
        <div className="flex flex-row flex-wrap items-center justify-center w-full min-h-[250px] text-lg font-semibold text-neutral-400 italic">
          {t("No data found")}
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

      {chosenTerm && (
        <StartTermModal
          termId={chosenTerm.termId}
          termName={chosenTerm.name}
          show={startModal}
          onClose={handleCloseStartTermModal}
          onStartTermSuccessfully={onStartTermSuccessfully}
        />
      )}

      {chosenTerm && (
        <DeleteTermModal
          show={showDeleteModal}
          termId={chosenTerm.termId}
          termName={chosenTerm.name}
          onClose={() => {
            setShowDeleteModal(false);
          }}
          onDeleteSuccessFully={() => setShowDeleteModal(false)}
        />
      )}

      {chosenTerm && (
        <TermActionContextMenu
          show={showContextMenu}
          top={contextMenuTop}
          left={contextMenuLeft}
          showStartTerm={chosenTerm.status.code === "NEW"}
          showDeleteTerm={chosenTerm.status.code === "NEW"}
          onStartTerm={() => {
            setStartModal(true);
          }}
          onCreateTerm={onCreateTermClick}
          onDeleteTerm={() => {
            setShowDeleteModal(true);
          }}
          onEditTerm={() => {
            navigate(`/term-management/update/${chosenTerm.termId}`);
          }}
          onViewTermDetail={() => {
            navigate(
              `/term-management/detail/information/${chosenTerm.termId}`,
            );
          }}
        />
      )}
    </div>
  );
};
