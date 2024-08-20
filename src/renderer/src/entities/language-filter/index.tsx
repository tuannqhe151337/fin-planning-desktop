import Select from "react-select";
import { Language, LanguageCode, languages } from "../../type";

export interface Option {
  value: LanguageCode;
  label: string;
}

const DefaultOption: Option = {
  value: "en",
  label: "English",
};

const convertLanguageDataToOptions = (
  languages: Language[],
  excludeCode?: LanguageCode
) => {
  return languages
    .map(({ code, name }) => ({ label: name, value: code }))
    .filter(({ value }) => value !== excludeCode);
};

interface Props {
  option?: Option;
  onChange?: (option: Option | null | undefined) => void;
}

export const LanguageFilter: React.FC<Props> = ({
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
          ...convertLanguageDataToOptions(
            Object.values(languages),
            option.value
          ),
        ]}
      />
    </div>
  );
};
