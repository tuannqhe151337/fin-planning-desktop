import { Variants, motion } from "framer-motion";
import CountUp from "react-countup";
import { OverviewCard } from "../../entities/overview-card";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { PiOfficeChairFill, PiTreeStructureFill } from "react-icons/pi";
import { FaPiggyBank, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLazyFetchAnnualReportDetailQuery } from "../../providers/store/api/annualsAPI";
import { useMeQuery } from "../../providers/store/api/authApi";
import { Role } from "../../providers/store/api/type";
import { useEffect } from "react";
import { useLazyGetAdminStatisticQuery } from "../../providers/store/api/dashboardAPI";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
};

const childrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

export const TopListOverviewCard: React.FC = () => {
  // i18n
  const { t } = useTranslation(["annual-report-detail"]);

  // Me query
  const { data: me } = useMeQuery();

  // Get annual report detail for overview card
  const [
    fetchAnnualReportDetail,
    { data: annual, isFetching: isAnnualReportFetching },
  ] = useLazyFetchAnnualReportDetailQuery();

  const [
    getAdminStatistic,
    { data: adminStats, isFetching: isAdminStatsFetching },
  ] = useLazyGetAdminStatisticQuery();

  useEffect(() => {
    if (
      me?.role.code === Role.FINANCIAL_STAFF ||
      me?.role.code === Role.ACCOUNTANT
    ) {
      fetchAnnualReportDetail(new Date().getFullYear());
    } else if (me?.role.code === Role.ADMIN) {
      getAdminStatistic();
    }
  }, [me]);

  return (
    <motion.div
      className="flex flex-row flex-wrap justify-between gap-5 w-full"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={staggerChildrenAnimation}
    >
      {(me?.role.code === Role.ACCOUNTANT ||
        me?.role.code === Role.FINANCIAL_STAFF) && (
        <>
          <motion.div className="flex-1" variants={childrenAnimation}>
            <OverviewCard
              icon={<RiCalendarScheduleFill className="text-4xl" />}
              label={t("Total terms")}
              isFetching={isAnnualReportFetching}
              value={
                <CountUp start={0} end={annual?.totalTerm || 0} duration={4} />
              }
              meteors
            />
          </motion.div>

          <motion.div className="flex-1" variants={childrenAnimation}>
            <OverviewCard
              icon={<PiTreeStructureFill className="text-4xl" />}
              label={t("Total departments")}
              isFetching={isAnnualReportFetching}
              value={
                <CountUp
                  start={0}
                  end={annual?.totalDepartment || 0}
                  duration={4}
                />
              }
            />
          </motion.div>

          <motion.div className="flex-1" variants={childrenAnimation}>
            <OverviewCard
              icon={<FaPiggyBank className="text-4xl" />}
              label={t("Total expenses")}
              isFetching={isAnnualReportFetching}
              value={
                <CountUp
                  start={0}
                  end={annual?.totalExpense || 0}
                  duration={4}
                  suffix=" VNĐ"
                />
              }
            />
          </motion.div>
        </>
      )}

      {me?.role.code === Role.ADMIN && (
        <>
          <motion.div className="flex-1" variants={childrenAnimation}>
            <OverviewCard
              icon={<FaUser className="text-4xl" />}
              label={t("Total users")}
              isFetching={isAdminStatsFetching}
              value={
                <CountUp
                  start={0}
                  end={adminStats?.totalEmployee || 0}
                  duration={4}
                />
              }
              meteors
            />
          </motion.div>

          <motion.div className="flex-1" variants={childrenAnimation}>
            <OverviewCard
              icon={<PiTreeStructureFill className="text-4xl" />}
              label={t("Total departments")}
              isFetching={isAdminStatsFetching}
              value={
                <CountUp
                  start={0}
                  end={adminStats?.totalDepartment || 0}
                  duration={4}
                />
              }
            />
          </motion.div>

          <motion.div className="flex-1" variants={childrenAnimation}>
            <OverviewCard
              icon={<PiOfficeChairFill className="text-4xl" />}
              label={t("Total positions")}
              isFetching={isAdminStatsFetching}
              value={
                <CountUp
                  start={0}
                  end={adminStats?.totalPosition || 0}
                  duration={4}
                />
              }
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
