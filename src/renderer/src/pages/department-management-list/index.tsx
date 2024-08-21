import { useEffect, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { Variants, motion } from "framer-motion";
import _ from "lodash";
import { Row, TableDepartment } from "../../widgets/table-department";
import { SearchBox } from "../../shared/search-box";
import { FaPlusCircle } from "react-icons/fa";
import {
  Department,
  departmentAPI,
  ListDepartmentParameters,
  useLazyGetListDepartmentQuery,
} from "../../providers/store/api/departmentApi";
import { DeleteDepartmentModal } from "../../widgets/delete-department-modal";
import { DepartmentCreateModal } from "../../widgets/department-create-modal";
import { DepartmentEditModal } from "../../widgets/department-edit-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";
import { useDispatch } from "react-redux";

const generateEmptyDepartments = (total: number): Department[] => {
  const departments: Row[] = [];

  for (let i = 0; i < total; i++) {
    departments.push({
      departmentId: 0,
      name: "",
      createdAt: "",
      updatedAt: "",
      isFetching: true,
    });
  }

  return departments;
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

export const DepartmentManagementList: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ADMIN]);

  // Query
  const [fetchDepartments, { data, isFetching }] =
    useLazyGetListDepartmentQuery();

  // Scroll to top
  useScrollToTopOnLoad();

  // Clear previous cache
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(departmentAPI.util.resetApiState());
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
      const paramters: ListDepartmentParameters = {
        query: searchboxValue,
        page,
        pageSize: 10,
      };

      fetchDepartments(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page]);

  // Delete department
  const [showDeleteDepartmentModal, setShowDeleteDepartmentModal] =
    useState<boolean>(false);

  const [chosenDeleteDepartment, setChosenDeleteDepartment] =
    useState<Department>();

  // Edit department
  const [showEditDepartmentModal, setShowEditDepartmentModal] =
    useState<boolean>(false);

  const [chosenEditDepartment, setChosenEditDepartment] =
    useState<Department>();

  // Create department
  const [showCreateDepartment, setShowCreateDepartment] =
    useState<boolean>(false);

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreateDepartment(true);
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
            Department management
          </p>
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowCreateDepartment(true);
              }}
            >
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                <FaPlusCircle className="text-xl" />
                <p className="text-sm font-semibold">New department</p>
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
        <TableDepartment
          onCreateDepartment={() => {
            setShowCreateDepartment(true);
          }}
          onDeleteDepartment={(department) => {
            setChosenDeleteDepartment(department);
            setShowDeleteDepartmentModal(true);
          }}
          onEditDepartment={(department) => {
            setChosenEditDepartment(department);
            setShowEditDepartmentModal(true);
          }}
          departments={isFetching ? generateEmptyDepartments(10) : data?.data}
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

      {chosenDeleteDepartment && (
        <DeleteDepartmentModal
          show={showDeleteDepartmentModal}
          department={chosenDeleteDepartment}
          onClose={() => {
            setShowDeleteDepartmentModal(false);
          }}
          onDeleteSuccessfully={() => {
            setShowDeleteDepartmentModal(false);
          }}
        />
      )}

      {chosenEditDepartment && (
        <DepartmentEditModal
          show={showEditDepartmentModal}
          department={chosenEditDepartment}
          onClose={() => {
            setShowEditDepartmentModal(false);
          }}
          onUpdateSuccessfully={() => {
            setShowEditDepartmentModal(false);
          }}
        />
      )}

      <DepartmentCreateModal
        show={showCreateDepartment}
        onClose={() => {
          setShowCreateDepartment(false);
        }}
        onCreateSuccessfully={() => {
          setShowCreateDepartment(false);
        }}
      />
    </motion.div>
  );
};
