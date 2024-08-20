import React from "react";
import { Tag } from "../../shared/tag";

interface Props {
  className?: string;
  statusCode: string;
}

export const ExpenseTag: React.FC<Props> = ({ statusCode, className }) => {
  switch (statusCode.toLowerCase().replace(/_/g, "")) {
    case "new":
      return (
        <Tag className={className} background="unfilled" variant="new">
          New
        </Tag>
      );
    case "denied":
      return (
        <Tag className={className} background="unfilled" variant="denied">
          Denied
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
    default:
      return null;
  }
};
