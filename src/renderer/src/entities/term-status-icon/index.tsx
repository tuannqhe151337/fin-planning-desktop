import React from "react";
import { TETooltip } from "tw-elements-react";
import { FaCircleDot } from "react-icons/fa6";
import { FaRegCircleDot } from "react-icons/fa6";

interface Props {
  status: string;
}

export const TermStatusIcon: React.FC<Props> = ({ status }) => {
  switch (status) {
    case "NEW":
      return (
        <TETooltip title="New">
          <FaRegCircleDot className="text-base text-green-600" />
        </TETooltip>
      );
    case "IN_PROGRESS":
      return (
        <TETooltip title="In progress">
          <FaCircleDot className="text-base text-primary-500" />
        </TETooltip>
      );
    case "CLOSED":
      return (
        <TETooltip title="Closed">
          <FaRegCircleDot className="text-base text-neutral-400/70" />
        </TETooltip>
      );
    default:
      return null;
  }
};
