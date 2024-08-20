import Select from "react-select";
import { Theme, ThemeCode, themes } from "../../type";

export interface Option {
  value: ThemeCode;
  label: string;
}

const DefaultOption: Option = {
  value: "blue",
  label: "Blue",
};

const convertThemeDataToOptions = (
  themes: Theme[],
  excludeCode?: ThemeCode
) => {
  return themes
    .map(({ code, name }) => ({ label: name, value: code }))
    .filter(({ value }) => value !== excludeCode);
};

interface Props {
  option?: Option;
  onChange?: (option: Option | null | undefined) => void;
}

export const ThemeFilter: React.FC<Props> = ({
  onChange,
  option = DefaultOption,
}) => {
  return (
    <div>
      <Select
        classNamePrefix="custom-select"
        className="w-[200px] cursor-pointer"
        isSearchable
        // isLoading={isFetching}
        value={option}
        onChange={(value) => {
          if (value) {
            onChange && onChange(value);
          }
        }}
        options={[
          option,
          ...convertThemeDataToOptions(Object.values(themes), option.value),
        ]}
      />
    </div>
  );
};
