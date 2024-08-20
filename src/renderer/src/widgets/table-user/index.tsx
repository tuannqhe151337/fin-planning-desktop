import { FaPlusCircle } from "react-icons/fa";
import { IconButton } from "../../shared/icon-button";
import { Pagination } from "../../shared/pagination";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { TableCell } from "./ui/table-cell";
import { TableCellUsername } from "./ui/table-cell-username";
import { TableCellIcon } from "./ui/table-cell-icon";
import { useNavigate } from "react-router-dom";
import { UserActiveConfirmModal } from "../user-active-confirm-modal";
import { UserDeactiveConfirmModal } from "../user-deactive-confirm-modal";
import { UserPreview } from "../../providers/store/api/usersApi";
import { useHotkeys } from "react-hotkeys-hook";
import { UserActionContextMenu } from "../../entities/user-action-context-menu";
import { useTranslation } from "react-i18next";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
    transition: {
      delay: 0.4,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
    },
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

export interface Row extends UserPreview {
  isFetching?: boolean;
}

interface Props {
  isFetching?: boolean;
  users?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onDeactivateSuccessfully?: (user: UserPreview) => any;
  onActivateSuccessfully?: (user: UserPreview) => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const UserTable: React.FC<Props> = ({
  users,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onDeactivateSuccessfully,
  onActivateSuccessfully,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // i18n
  const { t } = useTranslation(["table-user"]);

  // Navigation
  const navigate = useNavigate();
  const [hoverRowIndex, setHoverRowIndex] = useState<number>();

  // Deactivate and activate user's id state
  const [chosenUser, setChosenUser] = useState<UserPreview>();

  // UI: activate and deactivate modal
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [deactiveModal, setDeactiveModal] = useState<boolean>(false);

  const handleCloseActiveModal = () => {
    setActiveModal(false);
  };

  const handleCloseDeactiveModal = () => {
    setDeactiveModal(false);
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
    <div>
      <div className="shadow rounded-lg">
        <table className="text-center text-sm font-light mt-6 min-w-full overflow-hidden rounded-lg">
          <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600 rounded-lg">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                {/* ID */}
                {t("ID")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 w-[220px] font-extrabold text-primary-500/80 dark:text-primary-600/80 text-left"
              >
                {/* Username */}
                {t("Username")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 w-[160px] font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                {/* Role */}
                {t("Role")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                {/* Email */}
                {t("Email")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                {/* Deparment */}
                {t("Department")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                {/* Position */}
                {t("Position")}
              </th>
              <th scope="col">
                <IconButton
                  className="px-3"
                  tooltip="Add new user"
                  onClick={() => {
                    navigate(`/user-management/create`);
                  }}
                >
                  <FaPlusCircle className="text-[21px] text-primary-500/60 hover:text-primary-500/80 my-0.5" />
                </IconButton>
              </th>
            </tr>
          </thead>
          <tbody className="min-h-[250px]">
            {users &&
              users.map((user, index) => (
                <motion.tr
                  key={index}
                  variants={rowAnimation}
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                  className={clsx({
                    "group border-b-2 border-neutral-100 dark:border-neutral-800 duration-200":
                      true,
                    "cursor-pointer": !isFetching,
                    "text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-400":
                      !user.deactivate,
                    "text-primary-500/70 hover:text-primary-500 dark:text-primary-800 dark:hover:text-primary-600":
                      user.deactivate,
                    "bg-white dark:bg-neutral-800/50": index % 2 === 0,
                    "hover:bg-primary-50/50 dark:hover:bg-neutral-800/70":
                      index % 2 === 0 && !isFetching,
                    "bg-primary-50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800":
                      index % 2 === 1,
                    "hover:bg-primary-100 dark:hover:bg-neutral-800":
                      index % 2 === 1 && !isFetching,
                  })}
                  onMouseEnter={() => {
                    setHoverRowIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoverRowIndex(undefined);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`detail/${user.userId}`);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setShowContextMenu(true);
                    setContextMenuLeft(e.pageX);
                    setContextMenuTop(e.pageY);
                    setChosenUser(user);
                  }}
                >
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[30px]"
                  >
                    {user.userId}
                  </TableCell>
                  <TableCellUsername
                    isFetching={isFetching}
                    skeletonClassName="w-[200px]"
                    deactivated={user.deactivate}
                  >
                    {user.username}
                  </TableCellUsername>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[100px]"
                  >
                    {user.role.name}
                  </TableCell>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[150px]"
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[150px]"
                  >
                    {user.department.name}
                  </TableCell>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[150px]"
                  >
                    {user.position.name}
                  </TableCell>
                  <TableCellIcon
                    isFetching={isFetching}
                    index={index}
                    hoverRowIndex={hoverRowIndex}
                    deactivated={user.deactivate}
                    onIconClick={() => {
                      if (user.deactivate) {
                        setActiveModal(true);
                      } else {
                        setDeactiveModal(true);
                      }
                      setChosenUser(user);
                    }}
                  ></TableCellIcon>
                </motion.tr>
              ))}
          </tbody>
        </table>

        {isDataEmpty && (
          <div className="flex flex-row flex-wrap items-center justify-center w-full min-h-[250px] text-lg font-semibold text-neutral-400 italic">
            {/* No data found. */}
            {t("No data found")}
          </div>
        )}
      </div>

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

      <UserActiveConfirmModal
        user={chosenUser}
        show={activeModal}
        onClose={handleCloseActiveModal}
        onActivateSuccessfully={(user) => {
          onActivateSuccessfully && onActivateSuccessfully(user);
          setActiveModal(false);
        }}
      />

      <UserDeactiveConfirmModal
        user={chosenUser}
        show={deactiveModal}
        onClose={handleCloseDeactiveModal}
        onDeactivateSuccessfully={(user) => {
          onDeactivateSuccessfully && onDeactivateSuccessfully(user);
          setDeactiveModal(false);
        }}
      />

      {chosenUser && (
        <UserActionContextMenu
          show={showContextMenu}
          left={contextMenuLeft}
          top={contextMenuTop}
          showActivateUser={chosenUser?.deactivate}
          showDeactivateUser={!chosenUser?.deactivate}
          onCreateUser={() => {
            navigate(`/user-management/create`);
          }}
          onEditUser={() => {
            navigate(`/user-management/edit/${chosenUser.userId}`);
          }}
          onActivateUser={() => {
            setActiveModal(true);
          }}
          onDeactivateUser={() => {
            setDeactiveModal(true);
          }}
          onViewDetail={() => {
            navigate(`/user-management/detail/${chosenUser.userId}`);
          }}
        />
      )}
    </div>
  );
};
