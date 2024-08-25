import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { YearFilter } from "../../entities/year-filter";
import { cn } from "../../shared/utils/cn";
import { useLazyGetMonthlyUserStatsQuery } from "../../providers/store/api/dashboardAPI";

interface Props {
  className?: string;
}

export const MonthlyUserChart: React.FC<Props> = React.memo(({ className }) => {
  // Select year
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Get chart's data
  const [getMonthlyUserStats, { data }] = useLazyGetMonthlyUserStatsQuery();

  useEffect(() => {
    if (year) {
      getMonthlyUserStats({ year });
    }
  }, [year]);

  const dataChart: ApexAxisChartSeries = useMemo(() => {
    const dataChart: ApexAxisChartSeries = [];

    if (data) {
      const NUMBER_USER_CREATED = "number_user_created";
      const NUMBER_USER_DELETED = "expected-number_user_deleted";

      const expectedActualCostMap: Record<string, number[]> = {
        [NUMBER_USER_CREATED]: [],
        [NUMBER_USER_DELETED]: [],
      };

      for (let monthlyRecord of data.data) {
        expectedActualCostMap[NUMBER_USER_CREATED].push(
          monthlyRecord.numberUserCreated,
        );
        expectedActualCostMap[NUMBER_USER_DELETED].push(
          monthlyRecord.numberUserDeleted,
        );
      }

      dataChart.push({
        name: "User joined",
        data: expectedActualCostMap[NUMBER_USER_CREATED],
      });

      dataChart.push({
        name: "User left",
        data: expectedActualCostMap[NUMBER_USER_DELETED],
      });
    }

    return dataChart;
  }, [data]);

  return (
    <div
      className={cn(
        "relative w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl pt-9 pb-12 px-8",
        className,
      )}
    >
      <div className="flex flex-row flex-wrap mb-8">
        <div>
          <p className="text-primary-500 dark:text-primary-400 font-bold text-lg">
            Monthly user statistics
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
            id: "monthly-user-chart",
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
          colors: ["#00E396", "#FF4560"],
          legend: { position: "top" },
        }}
        series={dataChart}
        type="area"
        height={350}
      />
    </div>
  );
});
