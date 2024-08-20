import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { useHotkeys } from "react-hotkeys-hook";
import { ContextMenu } from "../../shared/context-menu";
import { ContextMenuItem } from "../../shared/context-menu-item";

interface Props {
  className?: string;
  show?: boolean;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  onCreateDepartment?: () => any;
  onDeleteDepartment?: () => any;
  onEditDepartment?: () => any;
}

export const DepartmentActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  onCreateDepartment,
  onDeleteDepartment,
  onEditDepartment,
}) => {
  useHotkeys("c", () => {
    if (show) {
      onCreateDepartment && onCreateDepartment();
    }
  });

  useHotkeys("e", () => {
    if (show) {
      onEditDepartment && onEditDepartment();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      onDeleteDepartment && onDeleteDepartment();
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
        <ContextMenuItem
          icon={<FaPlusCircle className="text-xl dark:opacity-60" />}
          text={
            <>
              <span className="underline">C</span>
              <span>reate department</span>
            </>
          }
          onClick={onCreateDepartment}
        />
        <ContextMenuItem
          borderBottom
          icon={<AiFillEdit className="text-2xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">E</span>
              <span>dit department</span>
            </>
          }
          onClick={onEditDepartment}
        />
        <ContextMenuItem
          className="group-hover:text-red-600 dark:group-hover:text-red-600"
          icon={<FaTrash className="text-xl dark:opacity-60" />}
          text={
            <>
              <span className="underline">D</span>
              <span>elete department</span>
            </>
          }
          onClick={onDeleteDepartment}
        />
      </div>
    </ContextMenu>
  );
};
