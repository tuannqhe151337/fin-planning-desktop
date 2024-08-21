import { useState } from "react";
import Select from "react-select";
import { useGetAllExpenseStatusQuery } from "../../providers/store/api/statusApi";
import { ExpenseStatus } from "../../providers/store/api/type";

interface Option {
  value: number;
  label: string;
}

const DefaultOption: Option = {
  value: 0,
  label: "All Status",
};

const convertStatusToOptions = (
  roles: ExpenseStatus[],
  excludeRoleId?: number,
) => {
  return roles
    .map(({ statusId, name }) => ({ label: name, value: statusId }))
    .filter(({ value }) => value !== excludeRoleId);
};

interface Props {
  defaultOption?: Option;
  onChange?: (option: Option | null | undefined) => any;
}

export const StatusExpenseFilter: React.FC<Props> = ({
  onChange,
  defaultOption = DefaultOption,
}) => {
  // Fetch initial data
  const { data } = useGetAllExpenseStatusQuery();

  // Select state
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    defaultOption,
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
