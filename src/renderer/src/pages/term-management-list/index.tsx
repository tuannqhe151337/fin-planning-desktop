import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { Variants, motion } from "framer-motion";
import { IoIosAddCircle } from "react-icons/io";
import { Row, TableTermManagement } from "../../widgets/table-term";
import { ListTermFiler } from "../../widgets/list-term-filter";
import { TermCreateModal } from "../../widgets/term-create-modal";
import { useEffect, useState } from "react";
import {
  ListTermParameters,
  useLazyGetListTermQuery,
} from "../../providers/store/api/termApi";
import _ from "lodash";
import { useHotkeys } from "react-hotkeys-hook";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";
import { useTranslation } from "react-i18next";

const generateEmptyTerms = (total: number): Row[] => {
  const terms: Row[] = [];

  for (let i = 0; i < total; i++) {
    terms.push({
      termId: 0,
      name: "",
      status: {
        id: 0,
        name: "",
        code: "NEW",
      },
      startDate: "",
      endDate: "",
      isFetching: true,
    });
  }

  return terms;
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

export const TermManagementList: React.FC = () => {
  // i18n
  const { t } = useTranslation(["term-management"]);

  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Scroll to top
  useScrollToTopOnLoad();

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleCreateTermModal = () => {
    setShowCreateModal(false);
  };

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreateModal(true);
  });

  // Query
  const [getListTerm, { data, isFetching }] = useLazyGetListTermQuery();

  // Searchbox state
  const [searchboxValue, setSearchboxValue] = useState<string>("");
  const [statusId, setStatusId] = useState<number | null>();

  const [page, setPage] = useState<number>(1);

  // Is fetched data emptied (derived from data)
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>();

  useEffect(() => {
    setIsDataEmpty(!isFetching && data && data.data && data.data.length === 0);
  }, [data]);

  // Fetch plan on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const paramters: ListTermParameters = {
        query: searchboxValue,
        page,
        pageSize: 10,
      };
      if (statusId) {
        paramters.statusId = statusId;
      }

      getListTerm(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page, statusId]);

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
            {t("Term management")}
          </p>
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowCreateModal(true);
              }}
            >
              <div className="flex flex-row flex-wrap items-center gap-3 text-white dark:text-neutral-300">
                <IoIosAddCircle className="text-2xl -mt-0.5" />

                <p className="text-sm font-bold">{t("Add new term")}</p>
              </div>
            </Button>
          </div>
        </div>
      </BubbleBanner>

      <motion.div variants={childrenAnimation}>
        <ListTermFiler
          searchboxValue={searchboxValue}
          onSearchboxChange={(value) => {
            setSearchboxValue(value);
          }}
          onStatusIdChange={(statusId) => {
            setStatusId(statusId);
          }}
        />
      </motion.div>

      <motion.div variants={childrenAnimation}>
        <TableTermManagement
          onCreateTermClick={() => {
            setShowCreateModal(true);
          }}
          terms={isFetching ? generateEmptyTerms(10) : data?.data}
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

      <TermCreateModal show={showCreateModal} onClose={handleCreateTermModal} />
    </motion.div>
  );
};
