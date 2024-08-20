import { useState } from "react";
import Select from "react-select";
import {
  TermStatus,
  useGetListStatusTermQuery,
} from "../../providers/store/api/statusApi";

interface Option {
  value: number;
  label: string;
}

const DefaultOption: Option = {
  value: 0,
  label: "All Status",
};

const convertStatusToOptions = (
  roles: TermStatus[],
  excludeRoleId?: number
) => {
  return roles
    .map(({ id, name }) => ({ label: name, value: id }))
    .filter(({ value }) => value !== excludeRoleId);
};

interface Props {
  defaultOption?: Option;
  onChange?: (option: Option | null | undefined) => any;
}

export const StatusTermFilter: React.FC<Props> = ({
  onChange,
  defaultOption = DefaultOption,
}) => {
  // Fetch initial data
  const { data } = useGetListStatusTermQuery();

  // Select state
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    defaultOption
  );

  return (
    <div>
      <Select
        classNamePrefix="custom-select"
        className="w-[200px] cursor-pointer"
        isSearchable
        value={selectedOption}
        onChange={(value) => {
          if (value) {
            setSelectedOption(value);
            onChange && onChange(value);
          }
        }}
        options={[
          defaultOption,
          ...convertStatusToOptions(data?.data || [], defaultOption.value),
        ]}
      />
    </div>
  );
};
