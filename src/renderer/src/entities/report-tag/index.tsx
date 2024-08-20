import React from "react";
import { Tag } from "../../shared/tag";
import { ReportStatusCode } from "../../providers/store/api/reportsAPI";

interface Props {
  className?: string;
  statusCode: ReportStatusCode;
}

export const ReportTag: React.FC<Props> = ({ statusCode, className }) => {
  switch (statusCode.toLowerCase().replace(/_/g, "")) {
    case "new":
      return (
        <Tag className={className} background="unfilled" variant="new">
          New
        </Tag>
      );

    case "reviewed":
      return (
        <Tag className={className} background="filled" variant="inProgress">
          Reviewed
        </Tag>
      );

    case "waitingforapproval":
      return (
        <Tag className={className} background="unfilled" variant="waiting">
          Waiting for approval
        </Tag>
      );

    case "approved":
      return (
        <Tag className={className} background="filled" variant="reviewed">
          Approved
        </Tag>
      );

    case "closed":
      return (
        <Tag className={className} background="unfilled" variant="deactivate">
          Closed
        </Tag>
      );
    default:
      return null;
  }
};
