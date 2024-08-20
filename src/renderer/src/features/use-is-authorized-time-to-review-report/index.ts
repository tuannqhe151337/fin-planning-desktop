import { useMemo } from "react";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";
import { ReportStatusCode } from "../../providers/store/api/reportsAPI";

interface Parameters {
  reportStatusCode?: ReportStatusCode;
  termEndDate?: string;
  termReuploadStartDate?: string;
  allowReupload?: boolean;
  termReuploadEndDate?: string;
  finalEndTermDate?: string;
}

export const useIsAuthorizedAndTimeToReviewReport = ({
  reportStatusCode,
  termEndDate,
  allowReupload,
  termReuploadStartDate,
  termReuploadEndDate,
  finalEndTermDate,
}: Parameters) => {
  const isTimeToReviewReport = useMemo(() => {
    const reportNotClosed = reportStatusCode !== "CLOSED";

    const betweenEndAndFinalEndDate =
      parseISOInResponse(termEndDate) <= new Date() &&
      parseISOInResponse(finalEndTermDate) >= new Date();

    if (!allowReupload) {
      return reportNotClosed && betweenEndAndFinalEndDate;
    }

    const betweenEndAndReuploadStartDate =
      parseISOInResponse(termEndDate) <= new Date() &&
      parseISOInResponse(termReuploadStartDate) >= new Date();

    const betweenReuploadEndDateAndFinalEndDate =
      parseISOInResponse(termReuploadEndDate) <= new Date() &&
      parseISOInResponse(finalEndTermDate) >= new Date();

    return (
      reportNotClosed &&
      (betweenEndAndReuploadStartDate || betweenReuploadEndDateAndFinalEndDate)
    );
  }, [
    reportStatusCode,
    termEndDate,
    termReuploadStartDate,
    termReuploadEndDate,
    finalEndTermDate,
  ]);

  return isTimeToReviewReport;
};
