import { FaInfoCircle, FaChartPie, FaDownload } from "react-icons/fa";
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
  onOverviewClick?: () => any;
  onDetailClick?: () => any;
  onDownloadClick?: () => any;
}

export const AnnualReportActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  onOverviewClick,
  onDetailClick,
  onDownloadClick,
}) => {
  useHotkeys("o", () => {
    if (show) {
      onOverviewClick && onOverviewClick();
    }
  });

  useHotkeys("v", () => {
    if (show) {
      onDetailClick && onDetailClick();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      onDownloadClick && onDownloadClick();
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
          icon={<FaChartPie className="text-xl dark:opacity-60" />}
          text={
            <>
              <span className="underline">O</span>
              <span>verview</span>
            </>
          }
          onClick={onOverviewClick}
        />
        <ContextMenuItem
          borderBottom
          icon={<FaInfoCircle className="text-xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">V</span>
              <span>iew detail</span>
            </>
          }
          onClick={onDetailClick}
        />
        <ContextMenuItem
          borderBottom
          icon={<FaDownload className="text-xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">D</span>
              <span>ownload</span>
            </>
          }
          onClick={onDownloadClick}
        />
      </div>
    </ContextMenu>
  );
};
