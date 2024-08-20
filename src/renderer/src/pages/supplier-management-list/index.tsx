import { useEffect, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { Variants, motion } from "framer-motion";
import _ from "lodash";
import { Row, TableSupplier } from "../../widgets/table-supplier";
import { SearchBox } from "../../shared/search-box";
import { FaPlusCircle } from "react-icons/fa";
import {
  Supplier,
  ListSupplierParameters,
  useLazyGetListSupplierQuery,
  supplierAPI,
} from "../../providers/store/api/supplierApi";
import { DeleteSupplierModal } from "../../widgets/delete-supplier-modal";
import { SupplierCreateModal } from "../../widgets/supplier-create-modal";
import { SupplierEditModal } from "../../widgets/supplier-edit-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { useDispatch } from "react-redux";

const generateEmptySuppliers = (total: number): Supplier[] => {
  const suppliers: Row[] = [];

  for (let i = 0; i < total; i++) {
    suppliers.push({
      supplierId: 0,
      name: "",
      createdAt: "",
      updatedAt: "",
      isFetching: true,
    });
  }

  return suppliers;
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

export const SupplierManagementList: React.FC = () => {
  // Scroll to top
  useScrollToTopOnLoad();

  // Query
  const [fetchSuppliers, { data, isFetching }] = useLazyGetListSupplierQuery();

  // Clear previous cache
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(supplierAPI.util.resetApiState());
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
      const paramters: ListSupplierParameters = {
        query: searchboxValue,
        sortBy: "name",
        sortType: "asc",
        page,
        pageSize: 10,
      };

      fetchSuppliers(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page]);

  // Delete Supplier
  const [showDeleteSupplierModal, setShowDeleteSupplierModal] =
    useState<boolean>(false);

  const [chosenDeleteSupplier, setChosenDeleteSupplier] = useState<Supplier>();

  // Edit Supplier
  const [showEditSupplierModal, setShowEditSupplierModal] =
    useState<boolean>(false);

  const [chosenEditSupplier, setChosenEditSupplier] = useState<Supplier>();

  // Create Supplier
  const [showCreateSupplier, setShowCreateSupplier] = useState<boolean>(false);

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreateSupplier(true);
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
            Supplier management
          </p>
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowCreateSupplier(true);
              }}
            >
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                <FaPlusCircle className="text-xl" />
                <p className="text-sm font-semibold">New supplier</p>
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
        <TableSupplier
          onCreateSupplier={() => {
            setShowCreateSupplier(true);
          }}
          onDeleteSupplier={(supplier) => {
            setChosenDeleteSupplier(supplier);
            setShowDeleteSupplierModal(true);
          }}
          onEditSupplier={(supplier) => {
            setChosenEditSupplier(supplier);
            setShowEditSupplierModal(true);
          }}
          suppliers={isFetching ? generateEmptySuppliers(10) : data?.data}
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

      {chosenDeleteSupplier && (
        <DeleteSupplierModal
          show={showDeleteSupplierModal}
          supplier={chosenDeleteSupplier}
          onClose={() => {
            setShowDeleteSupplierModal(false);
          }}
          onDeleteSuccessfully={() => {
            setShowDeleteSupplierModal(false);
          }}
        />
      )}

      {chosenEditSupplier && (
        <SupplierEditModal
          show={showEditSupplierModal}
          supplier={chosenEditSupplier}
          onClose={() => {
            setShowEditSupplierModal(false);
          }}
          onUpdateSuccessfully={() => {
            setShowEditSupplierModal(false);
          }}
        />
      )}

      <SupplierCreateModal
        show={showCreateSupplier}
        onClose={() => {
          setShowCreateSupplier(false);
        }}
        onCreateSuccessfully={() => {
          setShowCreateSupplier(false);
        }}
      />
    </motion.div>
  );
};
