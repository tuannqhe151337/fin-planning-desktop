import { AsyncPaginate } from "react-select-async-paginate";
import type { LoadOptions } from "react-select-async-paginate";
import { useState, useMemo } from "react";

interface YearOption {
  value: number;
  label: string;
}

const DefaultOption: YearOption = {
  value: 0,
  label: "All year",
};

interface Props {
  onChange?: (option: YearOption | null) => any;
  defaultOption?: YearOption;
}

export const YearFilter: React.FC<Props> = ({
  onChange,
  defaultOption = DefaultOption,
}) => {
  // Select state
  const [selectedOption, setSelectedOption] = useState<YearOption | null>(
    defaultOption
  );

  // Generate year options
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1980; year--) {
      if (year !== defaultOption.value) {
        years.push({ value: year, label: year.toString() });
      }
    }
    return years;
  }, []);

  // Convert data to option
  const loadOptions: LoadOptions<YearOption, any, any> = async (
    inputValue,
    _,
    { page }
  ) => {
    // Filter options based on inputValue
    const filteredOptions = yearOptions.filter((option) =>
      option.label.includes(inputValue)
    );

    // Paginate options
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedOptions = filteredOptions.slice(startIndex, endIndex);

    const hasMore = endIndex < filteredOptions.length;

    return {
      options:
        page === 1 ? [defaultOption, ...paginatedOptions] : paginatedOptions,
      hasMore,
      additional: { page: page + 1 },
    };
  };

  return (
    <div>
      <AsyncPaginate
        classNamePrefix="custom-select"
        className="w-[200px] cursor-pointer"
        value={selectedOption}
        onChange={(value) => {
          setSelectedOption(value);
          onChange && onChange(value);
        }}
        loadOptions={loadOptions}
        additional={{
          page: 1,
        }}
      />
    </div>
  );
};
