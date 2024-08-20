import { AiFillEdit } from "react-icons/ai";
import { FaPowerOff, FaUser } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { useHotkeys } from "react-hotkeys-hook";
import { ContextMenu } from "../../shared/context-menu";
import { ContextMenuItem } from "../../shared/context-menu-item";
import { LuPowerOff } from "react-icons/lu";

interface Props {
  className?: string;
  show?: boolean;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  showActivateUser?: boolean;
  showDeactivateUser?: boolean;
  onCreateUser?: () => any;
  onActivateUser?: () => any;
  onDeactivateUser?: () => any;
  onEditUser?: () => any;
  onViewDetail?: () => any;
}

export const UserActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  showActivateUser,
  showDeactivateUser,
  onCreateUser,
  onDeactivateUser,
  onActivateUser,
  onEditUser,
  onViewDetail,
}) => {
  useHotkeys("c", () => {
    if (show) {
      onCreateUser && onCreateUser();
    }
  });

  useHotkeys("e", () => {
    if (show) {
      onEditUser && onEditUser();
    }
  });

  useHotkeys("a", () => {
    if (show) {
      showActivateUser && onActivateUser && onActivateUser();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      showDeactivateUser && onDeactivateUser && onDeactivateUser();
    }
  });

  useHotkeys("v", () => {
    if (show) {
      onViewDetail && onViewDetail();
    }
  });

  return (
    <ContextMenu
      className={className}
      show={show}
      top={top}
      left={left}
      bottom={bottom}
      right={right}
    >
      <div className="flex flex-col flex-wrap items-center justify-center">
        {showActivateUser && (
          <ContextMenuItem
            borderBottom
            icon={<FaPowerOff className="text-xl dark:opacity-60" />}
            text={
              <>
                <span className="underline">A</span>
                <span>ctive User</span>
              </>
            }
            onClick={onActivateUser}
          />
        )}
        {showDeactivateUser && (
          <ContextMenuItem
            borderBottom
            className="group-hover:text-red-600 dark:group-hover:text-red-600"
            icon={<LuPowerOff className="text-xl dark:opacity-60" />}
            text={
              <>
                <span className="underline">D</span>
                <span>eactive User</span>
              </>
            }
            onClick={onDeactivateUser}
          />
        )}
        <ContextMenuItem
          icon={<FaPlusCircle className="text-xl dark:opacity-60" />}
          text={
            <>
              <span className="underline">C</span>
              <span>reate User</span>
            </>
          }
          onClick={onCreateUser}
        />
        <ContextMenuItem
          borderBottom
          icon={<AiFillEdit className="text-2xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">E</span>
              <span>dit User</span>
            </>
          }
          onClick={onEditUser}
        />
        <ContextMenuItem
          icon={<FaUser className="text-lg dark:opacity-60" />}
          text={
            <>
              <span className="underline">V</span>
              <span>iew detail</span>
            </>
          }
          onClick={onViewDetail}
        />
      </div>
    </ContextMenu>
  );
};
