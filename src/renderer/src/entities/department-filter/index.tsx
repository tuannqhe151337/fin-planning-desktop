import { AsyncPaginate } from "react-select-async-paginate";
import type { LoadOptions } from "react-select-async-paginate";
import { useState } from "react";
import { useLazyGetListDepartmentQuery } from "../../providers/store/api/departmentApi";
import { cn } from "../../shared/utils/cn";

interface DepartmentOption {
  value: number;
  label: string;
}

interface Additional {
  page: number;
}

const pageSize = 10;

const DefaultOption: DepartmentOption = {
  value: 0,
  label: "All department",
};

interface Props {
  className?: string;
  onChange?: (option: DepartmentOption | null) => any;
  defaultOption?: DepartmentOption;
}

export const DepartmentFilter: React.FC<Props> = ({
  className,
  onChange,
  defaultOption = DefaultOption,
}) => {
  // Fetch initial data
  const [getListDepartmentQuery, { isFetching }] =
    useLazyGetListDepartmentQuery();

  // Convert data to option
  const loadOptions: LoadOptions<DepartmentOption, any, Additional> = async (
    currentQuery,
    _,
    additional,
  ) => {
    const page = additional?.page || 1;

    // Fetch data
    const data = await getListDepartmentQuery({
      page,
      pageSize,
      query: currentQuery,
    }).unwrap();

    // Load options
    const hasMore = page < data.pagination.numPages;

    const loadOptions = {
      options: data?.data
        .map(({ departmentId: id, name }) => ({
          value: id,
          label: name,
        }))
        .filter(({ value }) => value !== defaultOption.value),
      hasMore,
    };

    // Default option
    if (page === 1 && currentQuery === "") {
      loadOptions.options.unshift(defaultOption);
    }

    return loadOptions;
  };

  // Select state
  const [selectedOption, setSelectedOption] = useState<DepartmentOption | null>(
    defaultOption,
  );

  return (
    <div>
      <AsyncPaginate
        classNamePrefix="custom-select"
        className={cn("w-[200px] cursor-pointer", className)}
        value={selectedOption}
        isLoading={isFetching}
        onChange={(value) => {
          if (value) {
            setSelectedOption(value);
            onChange && onChange(value);
          }
        }}
        // options={[defaultOption]}
        loadOptions={loadOptions}
        additional={{
          page: 1,
        }}
      />
    </div>
  );
};
