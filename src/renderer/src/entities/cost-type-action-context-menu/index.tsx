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
  onCreateCostType?: () => any;
  onDeleteCostType?: () => any;
  onEditCostType?: () => any;
}

export const CostTypeActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  onCreateCostType,
  onDeleteCostType,
  onEditCostType,
}) => {
  useHotkeys("c", () => {
    onCreateCostType && onCreateCostType();
  });

  useHotkeys("e", () => {
    onEditCostType && onEditCostType();
  });

  useHotkeys("d", () => {
    onDeleteCostType && onDeleteCostType();
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
              <span>reate cost type</span>
            </>
          }
          onClick={onCreateCostType}
        />
        <ContextMenuItem
          borderBottom
          icon={<AiFillEdit className="text-2xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">E</span>
              <span>dit cost type</span>
            </>
          }
          onClick={onEditCostType}
        />
        <ContextMenuItem
          className="group-hover:text-red-600 dark:group-hover:text-red-600"
          icon={<FaTrash className="text-xl dark:opacity-60" />}
          text={
            <>
              <span className="underline">D</span>
              <span>elete cost type</span>
            </>
          }
          onClick={onDeleteCostType}
        />
      </div>
    </ContextMenu>
  );
};
