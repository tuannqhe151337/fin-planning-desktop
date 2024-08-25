import Chart from "react-apexcharts";
import { cn } from "../../shared/utils/cn";
import { useEffect, useMemo, useState } from "react";
import { useLazyGetMonthlyCostTypeExpenseQuery } from "../../providers/store/api/dashboardAPI";
import {
  CostType,
  useGetAllCostTypeQuery,
} from "../../providers/store/api/costTypeAPI";
import { formatViMoney } from "@renderer/shared/utils/format-vi-money";

interface Props {
  year: number;
  className?: string;
  chosenCostTypeIdList?: number[];
}

export const MonthlyCostTypeExpenseChart: React.FC<Props> = ({
  year,
  className,
  chosenCostTypeIdList,
}) => {
  // Get cost type
  const { data: costTypeResult } = useGetAllCostTypeQuery();

  // Get chart's data
  const [getMonthlyCostType, { data }] =
    useLazyGetMonthlyCostTypeExpenseQuery();

  useEffect(() => {
    if (year) {
      getMonthlyCostType({ year });
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
            chosenCostTypeIdList.includes(costTypeId),
          ) || [];
      }
    } else if (chosenCostTypeIdList && chosenCostTypeIdList?.length === 0) {
      listCostType = [];
    }

    setListChosenCostType(listCostType);
  }, [chosenCostTypeIdList]);

  const dataChart: ApexAxisChartSeries = useMemo(() => {
    const dataChart: ApexAxisChartSeries = [];

    if (data && chosenCostTypeIdList) {
      // Map by cost type name and list amount corresponding to each month
      const costTypeMonthlyMap: Record<string, number[]> = {};

      // Fill all cost type to the map
      for (const costType of listChosenCostType) {
        costTypeMonthlyMap[costType.name] = [];
      }

      // For each monthly record:
      for (let monthlyCostType of data.data) {
        // Map by cost type and amount
        const costTypeMonthMap: Record<string, number> = {};
        for (const diagramResponse of monthlyCostType.diagramResponses) {
          costTypeMonthMap[diagramResponse.costType.name] =
            diagramResponse.totalCost;
        }

        // Insert all of cost type for that month, if it's not exists return 0
        for (const costType of listChosenCostType) {
          costTypeMonthlyMap[costType.name].push(
            costTypeMonthMap[costType.name] || 0,
          );
        }
      }

      // Map back from map to list data chart
      for (const [costTypeName, listAmount] of Object.entries(
        costTypeMonthlyMap,
      )) {
        dataChart.push({
          name: costTypeName,
          data: listAmount,
        });
      }
    }

    return dataChart;
  }, [data, listChosenCostType]);

  return (
    <div
      className={cn(
        "relative w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl pt-9 pb-12 px-8",
        className,
      )}
    >
      <div className="flex flex-row flex-wrap mb-8">
        <div>
          <p className="text-primary-500 dark:text-primary-400 font-bold text-xl">
            By month
          </p>
        </div>
      </div>
      <Chart
        options={{
          chart: {
            toolbar: { show: true, offsetY: 355 },
            animations: { enabled: true },
          },
          dataLabels: { enabled: false },
          stroke: { curve: "smooth" },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              stops: [0, 90, 100],
            },
          },
          legend: { position: "top" },
          yaxis: {
            labels: {
              formatter: (val) => {
                return formatViMoney(val);
              },
            },
          },
        }}
        series={dataChart}
        type="area"
        height={350}
      />
    </div>
  );
};
