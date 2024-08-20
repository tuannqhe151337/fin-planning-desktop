import { AsyncPaginate } from "react-select-async-paginate";
import type { LoadOptions } from "react-select-async-paginate";
import { useState } from "react";
import { useLazyGetListTermQuery } from "../../providers/store/api/termApi";

interface TermOption {
  value: number;
  label: string;
}

interface Additional {
  page: number;
}

const pageSize = 10;

const defaultOption: TermOption = {
  value: 0,
  label: "All term",
};

interface Props {
  onChange?: (option: TermOption | null) => any;
}

export const TermFilter: React.FC<Props> = ({ onChange }) => {
  // Fetch initial data
  const [getListTermQuery, { isFetching }] = useLazyGetListTermQuery();

  // Convert data to option
  const loadOptions: LoadOptions<TermOption, any, Additional> = async (
    currentQuery,
    _,
    additional
  ) => {
    const page = additional?.page || 1;

    // Fetch data
    const data = await getListTermQuery({
      page: page || 1,
      pageSize,
      query: currentQuery,
    }).unwrap();

    // Load options
    const hasMore = page < data.pagination.numPages;

    const loadOptions = {
      options: data?.data
        .map(({ termId: id, name }) => ({
          value: id,
          label: name,
        }))
        .filter(({ value }) => value !== defaultOption.value),
      hasMore,
      additional: {
        page: page + 1,
      },
    };

    // Default option
    if (page === 1 && currentQuery === "") {
      loadOptions.options.unshift(defaultOption);
    }

    return loadOptions;
  };

  // Select state
  const [selectedOption, setSelectedOption] = useState<TermOption | null>(
    defaultOption
  );

  return (
    <div>
      <AsyncPaginate
        classNamePrefix="custom-select"
        className="w-[200px] cursor-pointer"
        value={selectedOption}
        isLoading={isFetching}
        onChange={(value) => {
          if (value) {
            setSelectedOption(value);
            onChange && onChange(value);
          }
        }}
        options={[defaultOption]}
        loadOptions={loadOptions}
        additional={{
          page: 1,
        }}
      />
    </div>
  );
};
