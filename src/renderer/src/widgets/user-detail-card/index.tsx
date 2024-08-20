import { motion, Variants } from "framer-motion";
import { FaLocationDot, FaUser } from "react-icons/fa6";
import { FaBirthdayCake, FaPhoneAlt } from "react-icons/fa";
import { cn } from "../../shared/utils/cn";
import React from "react";
import { formatISODateFromResponse } from "../../shared/utils/format-iso-date-from-response";
import { UserListItem } from "./ui/user-list-item";
import { MdEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

const childrenAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 3,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

interface Props {
  className?: string;
  isLoading?: boolean;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  actionComponent?: React.ReactNode;
}

export const UserDetailCard: React.FC<Props> = ({
  className,
  isLoading,
  fullName,
  phone,
  email,
  dateOfBirth,
  address,
  actionComponent,
}) => {
  // i18n
  const { t } = useTranslation(["user-detail"]);

  return (
    <motion.div
      className={cn(
        "flex flex-row flex-wrap border rounded-lg p-6 bg-white shadow dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-[0_0_15px_rgb(0,0,0,0.2)]",
        className
      )}
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={staggerChildrenAnimation}
    >
      <div className="flex-1 space-y-4">
        <motion.div className="mt-2" variants={childrenAnimation}>
          <UserListItem
            isLoading={isLoading}
            icon={<FaUser />}
            label={t("Full name")}
            value={fullName}
          />
        </motion.div>

        <motion.div variants={childrenAnimation}>
          <UserListItem
            isLoading={isLoading}
            icon={<FaPhoneAlt />}
            label={t("Phone")}
            value={phone}
          />
        </motion.div>

        <motion.div variants={childrenAnimation}>
          <UserListItem
            isLoading={isLoading}
            icon={<MdEmail className="text-2xl -ml-0.5" />}
            label={t("Email")}
            value={email}
          />
        </motion.div>

        <motion.div variants={childrenAnimation}>
          <UserListItem
            isLoading={isLoading}
            icon={<FaBirthdayCake />}
            label={t("Date of birth")}
            value={formatISODateFromResponse(dateOfBirth)}
          />
        </motion.div>

        <motion.div variants={childrenAnimation}>
          <UserListItem
            isLoading={isLoading}
            icon={<FaLocationDot />}
            label={t("Address")}
            value={address}
          />
        </motion.div>
      </div>
      <div>{actionComponent}</div>
    </motion.div>
  );
};
