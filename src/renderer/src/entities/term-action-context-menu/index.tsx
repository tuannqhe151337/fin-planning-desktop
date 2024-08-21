import { FaInfoCircle } from "react-icons/fa";
import { useHotkeys } from "react-hotkeys-hook";
import { ContextMenu } from "../../shared/context-menu";
import { ContextMenuItem } from "../../shared/context-menu-item";
import { FaPlay, FaTrash } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";

interface Props {
  className?: string;
  show?: boolean;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  showStartTerm?: boolean;
  showDeleteTerm?: boolean;
  onStartTerm?: () => any;
  onCreateTerm?: () => any;
  onViewTermDetail?: () => any;
  onEditTerm?: () => any;
  onDeleteTerm?: () => any;
}

export const TermActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  showStartTerm,
  showDeleteTerm,
  onStartTerm,
  onCreateTerm,
  onViewTermDetail,
  onEditTerm,
  onDeleteTerm,
}) => {
  useHotkeys("s", () => {
    if (show) {
      showStartTerm && onStartTerm && onStartTerm();
    }
  });

  useHotkeys("c", () => {
    if (show) {
      onCreateTerm && onCreateTerm();
    }
  });

  useHotkeys("v", () => {
    if (show) {
      onViewTermDetail && onViewTermDetail();
    }
  });

  useHotkeys("e", () => {
    if (show) {
      onEditTerm && onEditTerm();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      showDeleteTerm && onDeleteTerm && onDeleteTerm();
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
        {showStartTerm && (
          <ContextMenuItem
            borderBottom
            icon={<FaPlay className="text-xl dark:opacity-60" />}
            text={
              <>
                <span className="underline">S</span>
                <span>tart term</span>
              </>
            }
            onClick={onStartTerm}
          />
        )}
        <ContextMenuItem
          borderBottom
          icon={<FaInfoCircle className="text-xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">V</span>
              <span>iew detail</span>
            </>
          }
          onClick={onViewTermDetail}
        />
        <ContextMenuItem
          icon={<IoIosAddCircle className="text-xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">C</span>
              <span>reate term</span>
            </>
          }
          onClick={onCreateTerm}
        />
        <ContextMenuItem
          borderBottom
          icon={<AiFillEdit className="text-xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">E</span>
              <span>dit term</span>
            </>
          }
          onClick={onEditTerm}
        />
        {showDeleteTerm && (
          <ContextMenuItem
            className="group-hover:text-red-600 dark:group-hover:text-red-600"
            icon={<FaTrash className="text-lg -ml-0.5" />}
            text={
              <>
                <span className="underline">D</span>
                <span>elete term</span>
              </>
            }
            onClick={onDeleteTerm}
          />
        )}
      </div>
    </ContextMenu>
  );
};
