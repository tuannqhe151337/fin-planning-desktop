import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";
import {
  AnnualReportChart,
  useLazyFetchAnnualReportChartQuery,
  useLazyFetchAnnualReportDetailQuery,
} from "../../providers/store/api/annualsAPI";
import { useEffect } from "react";
import { ApexOptions } from "apexcharts";

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

  if (!isFetching && isSuccess && !annual) return <p>No annual found</p>;

  const chartOptions: ApexOptions = {
    chart: { id: "annual-report-chart", toolbar: { show: false } },
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          labels: { show: true },
        },
      },
    },
  };

  return (
    <div className="mt-8">
      {isFetching && <p>Loading...</p>}
      {isSuccess && annual && (
        <Chart
          options={{
            ...chartOptions,
            labels: annual.data.map(
              (item: AnnualReportChart) => item.costType.name
            ),
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
