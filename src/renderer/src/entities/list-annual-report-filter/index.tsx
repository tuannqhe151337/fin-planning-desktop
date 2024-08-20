import { Variants, motion } from "framer-motion";
import { useState } from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";

interface YearOption {
  value: number;
  label: string;
}

const pageSize = 10;

const defaultOptionYear = {
  value: 0,
  label: "Year",
};

const yearDummyData = [
  {
    id: 1,
    year: "2024",
  },
  {
    id: 2,
    year: "2023",
  },
  {
    id: 3,
    year: "2022",
  },
  {
    id: 4,
    year: "2021",
  },
];

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

export const ListAnnualReportFilter: React.FC = () => {
  // Select state
  const [selectedOptionTerm, setSelectedOptionTerm] =
    useState<YearOption | null>(defaultOptionYear);

  // Fetch initial data
  const [pageYear, setPageYear] = useState<number>(1);

  // Convert data to option for year
  const loadYearOptions: LoadOptions<YearOption, any, any> = async () => {
    const hasMoreYear = pageYear * pageSize < yearDummyData.length;

    const loadOptionsYear = {
      options: yearDummyData?.map(({ id, year }) => ({
        value: id,
        label: year,
      })),
      hasMoreYear,
    };

    if (pageYear === 1) {
      loadOptionsYear.options.unshift(defaultOptionYear);
    }

    // Update page
    if (hasMoreYear) {
      setPageYear((pageYear) => pageYear + 1);
    }
    return loadOptionsYear;
  };
  return (
    <>
      <motion.div variants={childrenAnimation}>
        <AsyncPaginate
          className="w-[200px] cursor-pointer "
          value={selectedOptionTerm}
          onChange={(value) => setSelectedOptionTerm(value)}
          options={[defaultOptionYear]}
          loadOptions={loadYearOptions}
          classNamePrefix="custom-select"
        />
      </motion.div>
    </>
  );
};
