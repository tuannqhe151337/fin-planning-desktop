import { Variants, motion } from "framer-motion";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { useState } from "react";
import { TableCurrency } from "../../widgets/table-currency";
import { CurrencyCreateModal } from "../../widgets/currency-create-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { useGetAllCurrencyQuery } from "../../providers/store/api/currencyApi";
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

export const CurrencyManagementListPage: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Get all currencies
  const { data: currencies, isFetching } = useGetAllCurrencyQuery();

  // Scroll to top
  useScrollToTopOnLoad();

  // Currency create modal
  const [showCreateCurrencyModal, setShowCreateCurrencyModal] =
    useState<boolean>(false);

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreateCurrencyModal(true);
  });

  return (
    <motion.div
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <TableCurrency
        currencies={currencies?.data}
        isFetching={isFetching}
        onCreateCurrency={() => {
          setShowCreateCurrencyModal(true);
        }}
      />

      <CurrencyCreateModal
        show={showCreateCurrencyModal}
        onClose={() => {
          setShowCreateCurrencyModal(false);
        }}
        onCreateSuccessfully={() => {
          setShowCreateCurrencyModal(false);
        }}
      />
    </motion.div>
  );
};
