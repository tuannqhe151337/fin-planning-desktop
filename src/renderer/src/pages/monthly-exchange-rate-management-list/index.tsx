import { useEffect, useState } from "react";
import {
  ListMonthlyExchangeRateParameters,
  useLazyGetListMonthlyExchangeRateQuery,
} from "../../providers/store/api/exchangeRateApi";
import { TableExchangeRate } from "../../widgets/table-exchange-rate";
import { useInfiteLoaderWholePage } from "../../shared/hooks/use-infite-loader-whole-page";
import { YearFilter } from "../../entities/year-filter";

const pageSize = 10;

export const ExchangeRateManagementList: React.FC = () => {
  // Year filter
  const [year, setYear] = useState<number>();

  // Fetch data
  const [getListExchangeRate, { data, isFetching }] =
    useLazyGetListMonthlyExchangeRateQuery();

  useEffect(() => {
    const listExchangRateParam: ListMonthlyExchangeRateParameters = {
      page: 1,
      pageSize,
    };

    if (year) {
      listExchangRateParam.year = year;
    }

    getListExchangeRate(listExchangRateParam);
  }, [year]);

  // Infinite scroll
  useInfiteLoaderWholePage(() => {
    if (data && data.data.length < data.pagination.totalRecords) {
      const listExchangRateParam: ListMonthlyExchangeRateParameters = {
        page: data.pagination.page + 1,
        pageSize,
      };

      if (year) {
        listExchangRateParam.year = year;
      }

      getListExchangeRate(listExchangRateParam);
    }
  });

  return (
    <div>
      <div className="mt-5 ml-auto w-max">
        <YearFilter
          onChange={(option) => {
            option && setYear(option.value);
          }}
        />
      </div>
      <TableExchangeRate
        listMonthlyExchangeRate={data?.data}
        isFetching={isFetching}
      />
    </div>
  );
};
