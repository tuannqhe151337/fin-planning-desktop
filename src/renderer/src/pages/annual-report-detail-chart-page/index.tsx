import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";
import {
  AnnualReportChart,
  useLazyFetchAnnualReportChartQuery,
  useLazyFetchAnnualReportDetailQuery,
} from "../../providers/store/api/annualsAPI";
import { useEffect } from "react";
import { formatViMoney } from "../../shared/utils/format-vi-money";
import { useDetectDarkmode } from "../../shared/hooks/use-detect-darkmode";

export const AnnualReportDetailChartPage: React.FC = () => {
  // Get annual report detail
  const { year } = useParams<{ year: string }>();

  const [fetchAnnualReportDetail, { data: annualDetail }] =
    useLazyFetchAnnualReportDetailQuery();

  useEffect(() => {
    if (year) {
      fetchAnnualReportDetail(parseInt(year, 10), true);
    }
  }, [year]);

  // Get annual report chart
  const [fetchAnnualReportChart, { data: annual, isFetching, isSuccess }] =
    useLazyFetchAnnualReportChartQuery();

  useEffect(() => {
    if (annualDetail) {
      fetchAnnualReportChart(annualDetail.annualReportId, true);
    }
  }, [annualDetail]);

  // Is dark mode
  const isDarkmode = useDetectDarkmode();

  if (!isFetching && isSuccess && !annual) return <p>No annual found</p>;

  return (
    <div className="mt-8">
      {isFetching && <p>Loading...</p>}
      {isSuccess && annual && (
        <Chart
          options={{
            chart: { id: "annual-report-chart", toolbar: { show: false } },
            stroke: { show: isDarkmode ? false : true },
            dataLabels: { enabled: true },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    value: {
                      fontSize: "14px",
                      fontWeight: "bold",
                      formatter(val) {
                        return formatViMoney(parseFloat(val));
                      },
                    },
                  },
                },
              },
            },
            legend: {
              position: "bottom",
              labels: {
                colors: "#a3a3a3",
              },
            },
            labels: annual.data.map(
              (item: AnnualReportChart) => item.costType.name,
            ),
            yaxis: {
              labels: {
                formatter: (val) => {
                  return formatViMoney(val);
                },
              },
            },
          }}
          series={annual.data.map((item: AnnualReportChart) => item.totalCost)}
          type="donut"
          height={350}
        />
      )}
      {!isFetching && !isSuccess && <p>No data available</p>}
    </div>
  );
};
