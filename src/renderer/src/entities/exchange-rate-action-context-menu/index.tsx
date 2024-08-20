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
  onCreateExchangeRateAction?: () => any;
  onDeleteExchangeRateAction?: () => any;
}

export const ExchangeRateActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  onCreateExchangeRateAction,
  onDeleteExchangeRateAction,
}) => {
  useHotkeys("c", () => {
    if (show) {
      onCreateExchangeRateAction && onCreateExchangeRateAction();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      onDeleteExchangeRateAction && onDeleteExchangeRateAction();
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
              <span>reate monthly rate conversion</span>
            </>
          }
          onClick={onCreateExchangeRateAction}
        />
        <ContextMenuItem
          className="group-hover:text-red-600 dark:group-hover:text-red-600"
          icon={<FaTrash className="text-xl dark:opacity-60" />}
          text={
            <>
              <span className="underline">D</span>
              <span>elete monthly rate conversion</span>
            </>
          }
          onClick={onDeleteExchangeRateAction}
        />
      </div>
    </ContextMenu>
  );
};
