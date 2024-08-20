import React from "react";
import { Tag } from "../../shared/tag";

interface Props {
  status: string;
}

export const TermTag: React.FC<Props> = ({ status }) => {
  switch (status) {
    case "NEW":
      return (
        <Tag background="unfilled" variant="new">
          New
        </Tag>
      );
    case "IN_PROGRESS":
      return (
        <Tag background="filled" variant="inProgress">
          In progess
        </Tag>
      );
    case "CLOSED":
      return (
        <Tag background="unfilled" variant="deactivate">
          Closed
        </Tag>
      );
    default:
      return null;
  }
};
