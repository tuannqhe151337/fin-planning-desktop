import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";
import { useMeQuery } from "../../providers/store/api/authApi";

interface Parameters {
  planDepartmentId?: number;
  planTermStartDate?: string;
  planTermEndDate?: string;
  planTermReuploadStartDate?: string;
  planTermReuploadEndDate?: string;
}

export const useIsAuthorizedToReuploadFn = () => {
  const { data: me } = useMeQuery();

  return ({
    planDepartmentId,
    planTermStartDate,
    planTermEndDate,
    planTermReuploadStartDate,
    planTermReuploadEndDate,
  }: Parameters) => {
    const isPlanSameDepartmentWithUser = planDepartmentId === me?.department.id;

    const betweenTermStartEndDate =
      new Date() >= parseISOInResponse(planTermStartDate) &&
      new Date() <= parseISOInResponse(planTermEndDate);

    const betweenTermReuploadStartEndDate =
      new Date() >= parseISOInResponse(planTermReuploadStartDate) &&
      new Date() <= parseISOInResponse(planTermReuploadEndDate);

    return (
      isPlanSameDepartmentWithUser &&
      (betweenTermStartEndDate || betweenTermReuploadStartEndDate)
    );
  };
};
