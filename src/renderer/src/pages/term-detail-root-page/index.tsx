import { AnimatePresence, Variants, motion } from "framer-motion";
import { BubbleBanner } from "../../entities/bubble-banner";
// import { OverviewCard } from "./ui/overview-card";
import { FaPlay, FaTrash } from "react-icons/fa6";
import TabList from "../../shared/tab-list";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useCloseOutside } from "../../shared/hooks/use-close-popup";
import { IconButton } from "../../shared/icon-button";
import { HiDotsVertical } from "react-icons/hi";
import { TERipple } from "tw-elements-react";
import { Button } from "../../shared/button";
import { MdEdit } from "react-icons/md";
import { DeleteTermModal } from "../../widgets/delete-term-modal";
import { useLazyFetchTermDetailQuery } from "../../providers/store/api/termApi";
import { Skeleton } from "../../shared/skeleton";
import { StartTermModal } from "../../widgets/start-term-modal";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";
import { TermTag } from "../../entities/term-tag";
import { useTranslation } from "react-i18next";

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
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

type TabId = "detail" | "plan" | "report";

interface Props {
  onDeleteSuccessFully?: (termId: string | number) => any;
}

export const TermDetailRootPage: React.FC<Props> = ({
  onDeleteSuccessFully,
}) => {
  // i18n
  const { t } = useTranslation(["term-management"]);

  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Location
  const location = useLocation();

  const [startModal, setStartModal] = useState<boolean>(false);

  const handleClick = () => {
    setStartModal(true);
  };

  const handleCloseStartTermModal = () => {
    setStartModal(false);
  };

  const onStartTermSuccessfully = () => {
    setStartModal(false);
  };

  // Navigation
  const navigate = useNavigate();

  // Get term detail
  const { termId } = useParams<{ termId: string }>();

  const [
    fetchTermReportDetail,
    { data: term, isError, isFetching, isSuccess },
  ] = useLazyFetchTermDetailQuery();

  useEffect(() => {
    if (termId) {
      fetchTermReportDetail(parseInt(termId, 10), true);
    }
  }, [termId]);

  if (!isFetching && isSuccess && !term) return <p>{t("No data found")}</p>;

  // Show dropdown options
  const [showOptions, setShowOptions] = useState(false);

  const ref = useCloseOutside({
    open: showOptions,
    onClose: () => {
      setShowOptions(false);
    },
  });

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const handleClickDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleDeleteTermModal = () => {
    setDeleteModal(false);
  };

  // Tablist state
  const [selectedTabId, setSelectedTabId] = useState<TabId>("detail");

  useEffect(() => {
    const currentTabUrl = location.pathname
      .replace("/term-management/detail/", "")
      .split("/")[0];

    switch (currentTabUrl) {
      case "information":
        setSelectedTabId("detail");
        break;

      case "plan":
        setSelectedTabId("plan");
        break;

      case "report":
        setSelectedTabId("report");
        break;
    }
  }, [location]);

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
              to={`/term-management`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              {t("Term management")}
            </Link>
            <span className="ml-3 text-base opacity-40">&gt;</span>
            <span>{t("Term detail")}</span>
          </p>
        </div>
      </BubbleBanner>

      {/* Title */}
      <AnimatePresence>
        {isFetching && <Skeleton className="mt-6 w-[400px] h-[40px]" />}
        {!isFetching && !isError && isSuccess && (
          <motion.div
            className="flex flex-row flex-wrap items-center mt-6 px-7"
            variants={childrenAnimation}
          >
            <p className="text-2xl font-extrabold text-primary mr-5">
              {term?.name}
            </p>

            <div className="flex flex-row flex-wrap gap-3">
              <TermTag status={term.status.code} />
            </div>

            <div className="flex flex-row flex-wrap gap-3 ml-auto">
              {/* Filter icon */}
              <motion.div variants={childrenAnimation}>
                <Button
                  className="flex flex-row flex-wrap py-1.5 px-3 mt-1"
                  onClick={() => {
                    navigate(`/term-management/update/${termId}`);
                  }}
                >
                  <MdEdit className="text-white dark:text-neutral-300 text-base mr-2 mt-[1.25px]" />
                  <div className="text-white dark:text-neutral-300 text-sm font-bold">
                    {t("Edit")}
                  </div>
                </Button>
              </motion.div>

              {/* Three dots icon */}
              <motion.div variants={childrenAnimation}>
                <div className="relative" ref={ref}>
                  <IconButton
                    onClick={() => {
                      setShowOptions((prevState) => !prevState);
                    }}
                  >
                    <HiDotsVertical className="text-xl text-primary" />
                  </IconButton>

                  <AnimatePresence>
                    {showOptions && (
                      <motion.div
                        className="absolute right-0 z-20 shadow bg-white dark:bg-neutral-800 rounded-lg mt-2 overflow-hidden"
                        initial={AnimationStage.HIDDEN}
                        animate={AnimationStage.VISIBLE}
                        exit={AnimationStage.HIDDEN}
                        variants={animation}
                      >
                        {term && term.status.code === "NEW" && (
                          <TERipple
                            rippleColor="light"
                            className="w-[160px]"
                            // onClick={() => {}}

                            onClick={(event) => {
                              event.stopPropagation();
                              handleClick();
                            }}
                          >
                            <div className="w-full flex flex-row flex-wrap items-center px-5 py-3 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-base font-bold duration-200">
                              <FaPlay className="mb-0.5 text-primary-400 dark:text-primary-600 mr-3 mt-[1.25px] dark:opacity-80" />
                              <p className="mt-0.5 text-primary-400 dark:text-primary-600 dark:opacity-80">
                                {t("Start term")}
                              </p>
                            </div>
                          </TERipple>
                        )}

                        <TERipple
                          rippleColor="light"
                          className="w-[160px]"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClickDeleteModal();
                          }}
                        >
                          <div className="w-full flex flex-row flex-wrap items-center px-5 py-3 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-base font-bold duration-200">
                            {/* <BsFillFileEarmarkArrowDownFill className="mb-0.5 mr-3 text-primary-400 dark:text-neutral-400" /> */}
                            <FaTrash className="mb-0.5 mr-3 text-red-400 dark:text-red-600 dark:opacity-80" />

                            <p className="mt-0.5 text-red-400 dark:text-red-600 dark:opacity-80">
                              {t("Delete term")}
                            </p>
                          </div>
                        </TERipple>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-7 px-5">
        <div className="w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl py-7 px-8">
          <div className="border-b-2 border-b-neutral-200 dark:border-b-neutral-700">
            <TabList
              className="-mb-0.5"
              selectedItemId={selectedTabId}
              items={[
                { id: "detail", name: t("Detail") },
                { id: "plan", name: t("Plan") },
                { id: "report", name: t("Report") },
              ]}
              onItemChangeHandler={({ id }) => {
                switch (id) {
                  case "detail":
                    navigate(`./information/${termId}`);
                    break;

                  case "plan":
                    navigate(`./plan/${termId}`);
                    break;

                  case "report":
                    navigate(`./report/${termId}`);
                    break;

                  default:
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

      {term && (
        <DeleteTermModal
          show={deleteModal}
          termId={term.id}
          termName={term.name}
          onClose={handleDeleteTermModal}
          onDeleteSuccessFully={onDeleteSuccessFully}
        />
      )}

      {/* <StartTermModal /> */}

      {term && (
        <StartTermModal
          termId={term.id}
          termName={term.name}
          show={startModal}
          onClose={handleCloseStartTermModal}
          onStartTermSuccessfully={onStartTermSuccessfully}
        />
      )}
    </motion.div>
  );
};
