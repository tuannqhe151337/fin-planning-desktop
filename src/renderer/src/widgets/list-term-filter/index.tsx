import { SearchBox } from "../../shared/search-box";
import { StatusTermFilter } from "../../entities/status-term-filter";

interface Props {
  searchboxValue?: string;
  onSearchboxChange?: (value: string) => any;
  onStatusIdChange?: (statusId: number | null | undefined) => any;
}

export const ListTermFiler: React.FC<Props> = ({
  searchboxValue,
  onSearchboxChange,
  onStatusIdChange,
}) => {
  return (
    <>
      <div className="flex flex-row flex-wrap w-full items-center mt-14 ">
        <div className="w-10/12">
          <SearchBox
            value={searchboxValue}
            onChange={(e) =>
              onSearchboxChange && onSearchboxChange(e.currentTarget.value)
            }
          />
        </div>
        <div className="pl-3 w-2/12">
          <StatusTermFilter
            onChange={(option) => {
              onStatusIdChange && onStatusIdChange(option?.value);
            }}
          />
        </div>
      </div>
    </>
  );
};
