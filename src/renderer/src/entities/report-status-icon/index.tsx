import React from "react";
import { ReportStatusCode } from "../../providers/store/api/reportsAPI";
import { TETooltip } from "tw-elements-react";
import { FaCircleDot } from "react-icons/fa6";
import { FaRegCircleDot } from "react-icons/fa6";
import { cn } from "../../shared/utils/cn";

interface Props {
  className?: string;
  statusCode: ReportStatusCode;
}

export const ReportStatusIcon: React.FC<Props> = ({
  statusCode,
  className,
}) => {
  switch (statusCode.toLowerCase().replace(/_/g, "")) {
    case "new":
      return (
        <TETooltip title="New">
          <FaRegCircleDot
            className={cn("text-base text-green-600", className)}
          />
        </TETooltip>
      );

    case "reviewed":
      return (
        <TETooltip title="Reviewed">
          <FaCircleDot
            className={cn("text-base text-primary-500", className)}
          />
        </TETooltip>
      );

    case "waitingforapproval":
      return (
        <TETooltip title="Waiting for approval">
          <FaRegCircleDot
            className={cn("text-base text-primary-500", className)}
          />
        </TETooltip>
      );

    case "closed":
      return (
        <TETooltip title="Closed">
          <FaRegCircleDot
            className={cn("text-base text-neutral-400/70", className)}
          />
        </TETooltip>
      );
    default:
      return null;
  }
};
