import { Variants, motion } from "framer-motion";
import { BubbleBanner } from "../../entities/bubble-banner";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TabList from "../../shared/tab-list";
import { useEffect, useState } from "react";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.15,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
      duration: 0.15,
    },
  },
};

const childrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

type TabId = "rate" | "currency";

export const ExchangeRateRootPage: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Navigate
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top
  useScrollToTopOnLoad();

  // Tablist state
  const [selectedTabId, setSelectedTabId] = useState<TabId>("rate");

  useEffect(() => {
    const currentTabUrl = location.pathname
      .replace("/exchange-rate/", "")
      .split("/")[0];

    switch (currentTabUrl) {
      case "":
        setSelectedTabId("rate");
        break;

      case "currency":
        setSelectedTabId("currency");
        break;
    }
  }, [location]);

  return (
    <motion.div
      className="px-6 pb-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto">
          <motion.p
            className="text-primary dark:text-primary/70 font-extrabold text-xl w-fit ml-7"
            variants={childrenAnimation}
          >
            Exchange rate
          </motion.p>
        </div>
      </BubbleBanner>

      <motion.div
        className="pt-7 mb-3 mx-7 border-b-2 dark:border-b-neutral-700"
        variants={childrenAnimation}
      >
        <TabList
          className="-mb-0.5"
          selectedItemId={selectedTabId}
          items={[
            { id: "rate", name: "Monthly rate" },
            { id: "currency", name: "Currency" },
          ]}
          onItemChangeHandler={({ id }) => {
            switch (id) {
              case "rate":
                navigate(`/exchange-rate`);
                break;

              case "currency":
                navigate(`/exchange-rate/currency`);
                break;

              default:
                break;
            }
          }}
        />
      </motion.div>

      <motion.div className="mx-7" variants={childrenAnimation}>
        <Outlet />
      </motion.div>
    </motion.div>
  );
};
