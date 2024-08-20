import { useState } from "react";
import { Role, useGetListRoleQuery } from "../../providers/store/api/roleApi";
import Select from "react-select";
import { cn } from "../../shared/utils/cn";

interface Option {
  value: number;
  label: string;
}

const DefaultOption: Option = {
  value: 0,
  label: "All role",
};

const convertRoleToOptions = (roles: Role[], excludeRoleId?: number) => {
  return roles
    .map(({ id, name }) => ({ label: name, value: id }))
    .filter(({ value }) => value !== excludeRoleId);
};

interface Props {
  defaultOption?: Option;
  onChange?: (option: Option | null | undefined) => any;
  className?: string;
}

export const RoleFilter: React.FC<Props> = ({
  onChange,
  defaultOption = DefaultOption,
  className,
}) => {
  // Fetch initial data
  const { data } = useGetListRoleQuery();

  // Select state
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);

  return (
    <div>
      <Select
        classNamePrefix="custom-select"
        // className="w-full cursor-pointer"
        className={cn("w-[200px] cursor-pointer", className)}
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
          ...convertRoleToOptions(data?.data || [], defaultOption.value),
        ]}
      />
    </div>
  );
};
