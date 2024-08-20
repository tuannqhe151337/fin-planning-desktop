import { FaInfoCircle, FaUpload } from "react-icons/fa";
import { useHotkeys } from "react-hotkeys-hook";
import { ContextMenu } from "../../shared/context-menu";
import { ContextMenuItem } from "../../shared/context-menu-item";
import { FaTrash } from "react-icons/fa6";
import { MdDownload } from "react-icons/md";
import { ReloadCloudIcon } from "../../shared/icons/reload-cloud-icon";

interface Props {
  className?: string;
  show?: boolean;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  showReuploadPlan?: boolean;
  showDeletePlan?: boolean;
  onUploadPlan?: () => any;
  onReuploadPlan?: () => any;
  onViewPlanDetail?: () => any;
  onDeletePlan?: () => any;
  onDownloadPlan?: () => any;
}

export const PlanActionContextMenu: React.FC<Props> = ({
  className,
  show,
  top,
  left,
  bottom,
  right,
  showReuploadPlan,
  showDeletePlan,
  onUploadPlan,
  onReuploadPlan,
  onViewPlanDetail,
  onDeletePlan,
  onDownloadPlan,
}) => {
  useHotkeys("u", () => {
    if (show) {
      onUploadPlan && onUploadPlan();
    }
  });

  useHotkeys("c", () => {
    if (show) {
      onUploadPlan && onUploadPlan();
    }
  });

  useHotkeys("d", () => {
    if (show) {
      onDownloadPlan && onDownloadPlan();
    }
  });

  useHotkeys("v", () => {
    if (show) {
      onViewPlanDetail && onViewPlanDetail();
    }
  });

  useHotkeys("r", () => {
    if (show) {
      showReuploadPlan && onReuploadPlan && onReuploadPlan();
    }
  });

  useHotkeys("e", () => {
    if (show) {
      showDeletePlan && onDeletePlan && onDeletePlan();
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
          onClick={onViewPlanDetail}
        />
        {showReuploadPlan && (
          <ContextMenuItem
            icon={
              <ReloadCloudIcon className="w-[24px] -ml-0.5 fill-neutral-500/80 dark:fill-neutral-400 group-hover:fill-primary-600" />
            }
            text={
              <>
                <span className="underline">R</span>
                <span>eupload plan</span>
              </>
            }
            onClick={onReuploadPlan}
          />
        )}
        <ContextMenuItem
          borderBottom
          icon={<MdDownload className="text-2xl -ml-0.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">D</span>
              <span>ownload plan</span>
            </>
          }
          onClick={onDownloadPlan}
        />

        <ContextMenuItem
          borderBottom
          icon={<FaUpload className="text-lg -mt-1.5 dark:opacity-60" />}
          text={
            <>
              <span className="underline">U</span>
              <span>pload new plan</span>
            </>
          }
          onClick={onUploadPlan}
        />
        {showDeletePlan && (
          <ContextMenuItem
            className="group-hover:text-red-600 dark:group-hover:text-red-600"
            icon={<FaTrash className="text-lg" />}
            text={
              <>
                <span>D</span>
                <span className="underline">e</span>
                <span>lete plan</span>
              </>
            }
            onClick={onDeletePlan}
          />
        )}
      </div>
    </ContextMenu>
  );
};
