import { ContextMenu } from "../../shared/context-menu";
import { ContextMenuItem } from "../../shared/context-menu-item";
import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  className?: string;
  show?: boolean;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  onApproveExpensesClick?: () => any;
  onDenyExpensesClick?: () => any;
}

export const ExpenseActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  onApproveExpensesClick,
  onDenyExpensesClick,
}) => {
  useHotkeys("a", () => {
    if (show) {
      onApproveExpensesClick && onApproveExpensesClick();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      onDenyExpensesClick && onDenyExpensesClick();
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
          borderBottom
          icon={<FaCheckCircle className="text-lg dark:opacity-60" />}
          text={
            <>
              <span className="underline">A</span>
              <span>pprove</span>
            </>
          }
          onClick={onApproveExpensesClick}
        />
        <ContextMenuItem
          borderBottom
          icon={<FaMinusCircle className="text-lg dark:opacity-60" />}
          text={
            <>
              <span className="underline">D</span>
              <span>eny</span>
            </>
          }
          onClick={onDenyExpensesClick}
        />
      </div>
    </ContextMenu>
  );
};
