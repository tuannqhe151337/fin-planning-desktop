// import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { RiPencilFill } from "react-icons/ri";
import { UserAvatarCard } from "../../widgets/user-avatar-card";
import { UserDetailCard } from "../../widgets/user-detail-card";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyFetchUserDetailQuery } from "../../providers/store/api/usersApi";
import { useEffect } from "react";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";
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
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const UserDetail: React.FC = () => {
  // i18n
  const { t } = useTranslation(["user-detail"]);

  // Authorized
  usePageAuthorizedForRole([Role.ADMIN]);

  // Navigate
  const navigate = useNavigate();

  // Get user detail
  const { userId } = useParams<{ userId: string }>();

  const [fetchUserDetail, { data: user, isFetching, isSuccess }] =
    useLazyFetchUserDetailQuery();

  useEffect(() => {
    if (userId) {
      fetchUserDetail(parseInt(userId, 10), true);
    }
  }, [userId]);

  if (!isFetching && isSuccess && !user) return <p>{t("No data found")}</p>;

  return (
    <div className="relative px-6">
      {/* Banner */}
      <BubbleBanner />

      <motion.div
        className="relative z-10 pb-10 w-11/12 -mt-10 mx-auto"
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        exit={AnimationStage.HIDDEN}
        variants={staggerChildrenAnimation}
      >
        <motion.div
          className="flex w-full gap-4 h-max"
          variants={childrenAnimation}
        >
          <UserAvatarCard
            className="w-1/3"
            isLoading={isFetching}
            username={user?.username || ""}
            role={user?.role.name || ""}
            position={user?.position.name || ""}
            department={user?.department.name || ""}
          />

          <UserDetailCard
            className="w-2/3"
            isLoading={isFetching}
            address={user?.address || ""}
            dateOfBirth={user?.dob || ""}
            email={user?.email || ""}
            fullName={user?.fullName || ""}
            phone={user?.phoneNumber || ""}
            actionComponent={
              <Button
                className="flex flex-row flex-wrap gap-2 items-center"
                onClick={() => {
                  navigate(`/user-management/edit/${userId}`);
                }}
              >
                <RiPencilFill className="text-xl mb-0.5" />
                <p className="text-sm font-bold">{t("Update user")}</p>
              </Button>
            }
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
