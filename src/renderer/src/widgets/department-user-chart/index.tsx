import React, { useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import { cn } from "../../shared/utils/cn";
import { useLazyGetDepartmentUserStatsQuery } from "../../providers/store/api/dashboardAPI";
import { FaChartPie } from "react-icons/fa6";
import { useDetectDarkmode } from "../../shared/hooks/use-detect-darkmode";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
}

export const DepartmentUserChart: React.FC<Props> = React.memo(
  ({ className }) => {
    // Translation
    const { t } = useTranslation(["home"]);

    // Get chart's data
    const [getDepartmentStats, { data }] = useLazyGetDepartmentUserStatsQuery();

    useEffect(() => {
      getDepartmentStats();
    });

    const dataChart: ApexNonAxisChartSeries = useMemo(() => {
      return data?.data.map(({ numberUser }) => numberUser || 0) || [];
    }, [data]);

    // Is dark mode
    const isDarkmode = useDetectDarkmode();

    return (
      <div
        className={cn(
          "flex flex-col w-full h-full border shadow dark:border-neutral-800 dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] rounded-xl py-7 px-8",
          className,
        )}
      >
        <div className="flex flex-row flex-wrap w-full mt-2.5">
          <div>
            <p className="text-primary-500 dark:text-primary-400 font-bold text-lg">
              {t("Department")}
            </p>
          </div>
        </div>
        <div className="mt-10 h-full">
          {/* Show chart */}
          {data?.data && data.data.length > 0 && (
            <Chart
              options={{
                chart: { toolbar: { show: true, offsetY: 345 } },
                stroke: { show: isDarkmode ? false : true },
                legend: { show: false },
                labels:
                  data?.data.map(({ department: { name } }) => name) || [],
                dataLabels: { enabled: true },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        value: {
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: isDarkmode ? "white" : "#9ca3af",
                        },
                      },
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
                  {t("No data")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
