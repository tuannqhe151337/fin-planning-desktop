import { Expense } from "../../../features/upload-file-stage/type";
import { UploadFileStage as UploadFileStageFeature } from "../../../features/upload-file-stage";
import { InputValidationMessage } from "../../../shared/validation-input-message";
import { DisabledSelect } from "../../../shared/disabled-select";
import { TEInput } from "tw-elements-react";
import { useMeQuery } from "../../../providers/store/api/authApi";
import { useMemo, useState } from "react";
import { useWindowHeight } from "@renderer/shared/utils/use-window-height";

interface Props {
  hide?: boolean;
  termName?: string;
  planName?: string;
  validateExpenseCode?: boolean;
  hideBackButton?: boolean;
  onDownloadTemplateClick?: Function;
  onPreviousState?: () => any;
  onNextStage?: (expenses: Expense[], planName: string) => any;
}

export const UploadFileStage: React.FC<Props> = ({
  hide,
  termName,
  planName: propsPlanName,
  validateExpenseCode,
  hideBackButton = false,
  onDownloadTemplateClick,
  onPreviousState,
  onNextStage,
}) => {
  // Department from user's detail
  const { data: me } = useMeQuery();

  // Plan name
  const [planName, setPlanName] = useState<string>(propsPlanName || "");

  // Calculate optimal height for dropzone
  const windowHeight = useWindowHeight();

  const dropzoneHeight = useMemo(() => {
    return windowHeight - 408;
  }, [windowHeight]);

  return (
    <UploadFileStageFeature
      hide={hide}
      dropzoneHeight={dropzoneHeight}
      inputSection={
        <div className="flex flex-row flex-wrap items-center justify-center gap-3">
          <div className="flex-1 -mb-[45px]">
            <TEInput
              className="w-full"
              label="Plan name"
              value={planName}
              onChange={(e) => setPlanName(e.currentTarget.value)}
              autoFocus
            />
            <InputValidationMessage
              className="mt-1"
              validateFn={() => {
                if (!planName) {
                  throw new Error("Plan name can not be empty.");
                }
              }}
            />
          </div>
          <DisabledSelect
            className="w-[300px]"
            label="Term"
            value={termName || ""}
            maxLengthBeforeTrim={32}
          />
          <DisabledSelect
            className="w-[200px]"
            label="Department"
            value={me?.department.name || ""}
            maxLengthBeforeTrim={16}
          />
        </div>
      }
      validateExpenseCode={validateExpenseCode}
      hideBackButton={hideBackButton}
      onDownloadTemplateClick={onDownloadTemplateClick}
      disableContinueButton={!planName}
      onPreviousState={onPreviousState}
      onNextStage={(expenses) => onNextStage && onNextStage(expenses, planName)}
    />
  );
};
