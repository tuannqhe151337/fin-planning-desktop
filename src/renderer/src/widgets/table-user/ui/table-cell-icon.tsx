import { Variants, motion } from "framer-motion";
import { IconButton } from "../../../shared/icon-button";
import { FaPowerOff } from "react-icons/fa6";
import { LuPowerOff } from "react-icons/lu";

interface Props {
  isFetching?: boolean;
  index: number;
  hoverRowIndex?: number;
  deactivated: boolean;
  onIconClick: () => void;
}

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
};

export const TableCellIcon: React.FC<Props> = ({
  isFetching,
  index,
  hoverRowIndex,
  deactivated,
  onIconClick,
}) => (
  <td className="whitespace-nowrap px-6 py-4">
    {!isFetching ? (
      <motion.div
        initial={AnimationStage.HIDDEN}
        animate={
          hoverRowIndex === index
            ? AnimationStage.VISIBLE
            : AnimationStage.HIDDEN
        }
        exit={AnimationStage.HIDDEN}
        variants={animation}
      >
        <IconButton
          tooltip={!deactivated ? "Deactivate user" : "Activate user"}
          onClick={(event) => {
            event.stopPropagation();
            onIconClick();
          }}
        >
          {!deactivated ? (
            <LuPowerOff className="text-red-600 text-xl" />
          ) : (
            <FaPowerOff className="text-primary-500 text-xl" />
          )}
        </IconButton>
      </motion.div>
    ) : <div className="w-[50px]"></div>}
  </td>
);
