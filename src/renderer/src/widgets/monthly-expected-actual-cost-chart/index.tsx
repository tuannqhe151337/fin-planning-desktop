import Chart from "react-apexcharts";
import { YearFilter } from "../../entities/year-filter";
import { cn } from "../../shared/utils/cn";
import { useEffect, useMemo, useState } from "react";
import { useLazyGetMonthlyExpectedActualCostQuery } from "../../providers/store/api/dashboardAPI";

interface Props {
  className?: string;
}

export const MonthlyExpectedActualCostChart: React.FC<Props> = ({
  className,
}) => {
  // Select year
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Get chart's data
  const [getMonthlyExpectedActualCost, { data }] =
    useLazyGetMonthlyExpectedActualCostQuery();

  useEffect(() => {
    if (year) {
      getMonthlyExpectedActualCost({ year });
    }
  }, [year]);

  const dataChart: ApexAxisChartSeries = useMemo(() => {
    const dataChart: ApexAxisChartSeries = [];

    if (data) {
      const ACTUAL_COST_KEY = "actual-cost";
      const EXPECTED_COST_KEY = "expected-cost";

      const expectedActualCostMap: Record<string, number[]> = {
        [ACTUAL_COST_KEY]: [],
        [EXPECTED_COST_KEY]: [],
      };

      for (let monthlyRecord of data.data) {
        expectedActualCostMap[ACTUAL_COST_KEY].push(monthlyRecord.actualCost);
        expectedActualCostMap[EXPECTED_COST_KEY].push(
          monthlyRecord.expectedCost
        );
      }

      dataChart.push({
        name: "Expected cost",
        data: expectedActualCostMap[EXPECTED_COST_KEY],
      });

      dataChart.push({
        name: "Actual cost",
        data: expectedActualCostMap[ACTUAL_COST_KEY],
      });
    }

    return dataChart;
  }, [data]);

  return (
    <div
      className={cn(
        "relative w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl pt-9 pb-12 px-8",
        className
      )}
    >
      <div className="flex flex-row flex-wrap mb-8">
        <div>
          <p className="text-primary-500 dark:text-primary-400 font-bold text-xl">
            Monthly expenses
          </p>
        </div>
        <div className="ml-auto">
          <YearFilter
            defaultOption={{
              value: new Date().getFullYear(),
              label: new Date().getFullYear().toString(),
            }}
            onChange={(option) => {
              option && setYear(option.value);
            }}
          />
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
        }}
        series={dataChart}
        type="area"
        height={350}
      />
    </div>
  );
};
