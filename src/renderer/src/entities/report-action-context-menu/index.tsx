import { FaCheck, FaInfoCircle } from "react-icons/fa";
import { useHotkeys } from "react-hotkeys-hook";
import { ContextMenu } from "../../shared/context-menu";
import { ContextMenuItem } from "../../shared/context-menu-item";
import { MdDownload, MdRateReview } from "react-icons/md";

interface Props {
  className?: string;
  show?: boolean;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  showReviewOption?: boolean;
  onViewDetail?: () => any;
  onReview?: () => any;
  onDownload?: () => any;
  onMarkAsReviewed?: () => any;
}

export const ReportActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  showReviewOption,
  onViewDetail,
  onMarkAsReviewed,
  onReview,
  onDownload,
}) => {
  useHotkeys("v", () => {
    if (show) {
      onViewDetail && onViewDetail();
    }
  });

  useHotkeys("m", () => {
    if (show) {
      showReviewOption && onMarkAsReviewed && onMarkAsReviewed();
    }
  });

  useHotkeys("r", () => {
    if (show) {
      showReviewOption && onReview && onReview();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      onDownload && onDownload();
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
          icon={<FaInfoCircle className="text-xl dark:opacity-60" />}
          text={
            <>
              <span className="underline">V</span>
              <span>iew detail</span>
            </>
          }
          onClick={onViewDetail}
        />
        {showReviewOption && (
          <ContextMenuItem
            icon={<FaCheck className="text-base dark:opacity-60 ml-0.5" />}
            text={
              <>
                <span className="underline">M</span>
                <span>ark as review complete</span>
              </>
            }
            onClick={onMarkAsReviewed}
          />
        )}
        {showReviewOption && (
          <ContextMenuItem
            borderBottom
            icon={<MdRateReview className="text-xl dark:opacity-60" />}
            text={
              <>
                <span className="underline">R</span>
                <span>eview report</span>
              </>
            }
            onClick={onReview}
          />
        )}

        <ContextMenuItem
          icon={<MdDownload className="text-2xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">D</span>
              <span>ownload report</span>
            </>
          }
          onClick={onDownload}
        />
      </div>
    </ContextMenu>
  );
};
