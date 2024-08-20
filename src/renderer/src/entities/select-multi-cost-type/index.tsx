import Select, { MultiValue } from "react-select";
import { cn } from "../../shared/utils/cn";
import { useGetAllCostTypeQuery } from "../../providers/store/api/costTypeAPI";
import { useMemo } from "react";

export interface CostTypeOption {
  value: number;
  label: string;
}

interface Props {
  className?: string;
  selectedOptions?: readonly CostTypeOption[];
  onChange?: (option: MultiValue<CostTypeOption> | null) => any;
}

export const SelectMultiCostType: React.FC<Props> = ({
  className,
  selectedOptions,
  onChange,
}) => {
  // Fetch all cost type
  const { data, isFetching } = useGetAllCostTypeQuery();

  const results = useMemo(() => {
    const results: CostTypeOption[] = [
      {
        value: 0,
        label: "All cost type",
      },
      ...(data?.data.map((costType) => ({
        value: costType.costTypeId,
        label: costType.name,
      })) || []),
    ];

    return results;
  }, [data]);

  return (
    <Select
      classNamePrefix="custom-select"
      className={cn("min-w-[200px] cursor-pointer", className)}
      isMulti
      isLoading={isFetching}
      value={selectedOptions}
      onChange={(value) => {
        if (value) {
          onChange && onChange(value);
        }
      }}
      options={results}
    />
  );
};
