import Chart from "react-apexcharts";
import { cn } from "../../shared/utils/cn";
import { useLazyGetYearlyCostTypeExpenseQuery } from "../../providers/store/api/dashboardAPI";
import { useEffect, useMemo, useState } from "react";
import {
  CostType,
  useGetAllCostTypeQuery,
} from "../../providers/store/api/costTypeAPI";
import { FaChartPie } from "react-icons/fa6";

interface Props {
  year: number;
  className?: string;
  chosenCostTypeIdList?: number[];
}

export const YearlyCostTypeExpenseChart: React.FC<Props> = ({
  year,
  className,
  chosenCostTypeIdList,
}) => {
  // Get cost type
  const { data: costTypeResult } = useGetAllCostTypeQuery();

  // Get chart's data
  const [getYearlyCostType, { data }] = useLazyGetYearlyCostTypeExpenseQuery();

  useEffect(() => {
    if (year) {
      getYearlyCostType({ year });
    }
  }, [year]);

  // Chosen cost type
  const [listChosenCostType, setListChosenCostType] = useState<CostType[]>([]);

  useEffect(() => {
    // List cost type for showing
    let listCostType: CostType[] = costTypeResult?.data || [];

    if (chosenCostTypeIdList && chosenCostTypeIdList.length > 0) {
      if (chosenCostTypeIdList.findIndex((id) => id === 0)) {
        listCostType =
          costTypeResult?.data.filter(({ costTypeId }) =>
            chosenCostTypeIdList.includes(costTypeId)
          ) || [];
      }
    } else if (chosenCostTypeIdList && chosenCostTypeIdList?.length === 0) {
      listCostType = [];
    }

    setListChosenCostType(listCostType);
  }, [chosenCostTypeIdList]);

  const dataChart: ApexNonAxisChartSeries = useMemo(() => {
    const costTypeMap: Record<string, number> = {};

    if (data) {
      for (let costTypeData of data.data) {
        costTypeMap[costTypeData.costType.name] = costTypeData.totalCost;
      }
    }

    return listChosenCostType.map(({ name }) => costTypeMap[name] || 0) || [];
  }, [data, listChosenCostType]);

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl py-7 px-8",
        className
      )}
    >
      <div className="flex flex-row flex-wrap w-full mt-2.5">
        <p className="text-primary-500 dark:text-primary-400 font-bold text-xl">
          By year
        </p>
      </div>
      <div className="mt-10 h-full">
        {/* Show chart */}
        {data?.data && data.data.length > 0 && (
          <Chart
            options={{
              chart: { toolbar: { show: true, offsetY: 345 } },
              legend: { show: false },
              labels: listChosenCostType.map(({ name }) => name) || [],
              dataLabels: { enabled: true },
              plotOptions: {
                pie: {
                  donut: {
                    labels: { show: true },
                  },
                },
              },
            }}
            series={dataChart}
            type="donut"
            height={370}
          />
        )}

        {/* Show empty */}
        {data?.data && data.data.length === 0 && (
          <div className="flex flex-row flex-wrap items-center justify-center h-full -mt-6">
            <div>
              <FaChartPie className="text-[220px] text-neutral-100 dark:text-neutral-800" />
              <div className="text-center text-lg font-bold mt-5 text-neutral-300 dark:text-neutral-700">
                No data
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
