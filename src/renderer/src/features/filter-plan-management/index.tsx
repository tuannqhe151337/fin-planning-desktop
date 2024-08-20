import { FaFilter } from "react-icons/fa6";

import { useState } from "react";

export const FilterManagementPlan: React.FC = () => {
  const [showFillterBtn, setShowFillterBtn] = useState(false);

  const handleOnClick = () => {
    setShowFillterBtn(!showFillterBtn);
  };

  return (
    <div className="relative z-10 mr-3">
      <div
        onClick={handleOnClick}
        className="flex flex-row flex-wrap items-center gap-2 mb-1 cursor-pointer"
      >
        <FaFilter className="text-2xl text-primary-500/60 hover:text-primary-500/80 mt-1" />
      </div>
    </div>
  );
};
