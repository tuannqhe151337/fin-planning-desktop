import React, { useEffect, useState } from "react";
import { Modal } from "../../shared/modal";
import { IconButton } from "../../shared/icon-button";
import { IoClose } from "react-icons/io5";
import { Button } from "../../shared/button";
import { TEInput } from "tw-elements-react";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputValidationMessage } from "../../shared/validation-input-message";
import {
  CostType,
  useUpdateCostTypeMutation,
} from "../../providers/store/api/costTypeAPI";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import clsx from "clsx";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import { ErrorData } from "../../providers/store/api/type";

type FormData = {
  costTypeName: string;
};

const CostTypeNameSchema = z
  .string()
  .min(5, "Cost type name length must be at least 5 characters")
  .max(50, "Cost type name length must be at most 50 characters");

export const UpdateCostTypeSchema: ZodType<FormData> = z.object({
  costTypeName: CostTypeNameSchema,
});

interface Props {
  show: boolean;
  costType: CostType;
  onClose: () => any;
  onUpdateSuccessfully?: () => any;
}

export const CostTypeEditModal: React.FC<Props> = ({
  show,
  costType,
  onClose,
  onUpdateSuccessfully,
}) => {
  // Form
  const {
    register,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(UpdateCostTypeSchema), // Apply the zodResolver
    defaultValues: {
      costTypeName: costType.name,
    },
  });

  // Reset
  useEffect(() => {
    reset();
  }, [show]);

  // Update form on external cost type name change
  useEffect(() => {
    setValue("costTypeName", costType.name);
  }, [costType]);

  // Update new CostType mutation
  const [updateCostType, { isSuccess, isLoading, isError, error }] =
    useUpdateCostTypeMutation();

  // On submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateCostType({
      costTypeId: costType.costTypeId,
      costTypeName: data.costTypeName,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Update cost type successfully!", { type: "success" });

      onUpdateSuccessfully && onUpdateSuccessfully();
    }
  }, [isLoading, isSuccess]);

  // Error message
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isError) {
      if (error && "data" in error && "message" in (error.data as any)) {
        setErrorMessage(
          uppercaseFirstCharacter((error.data as ErrorData).message)
        );
      } else {
        setErrorMessage("Something went wrong, please try again!");
      }
    }
  }, [isError]);

  return (
    <Modal
      className="w-[45vw] h-max flex flex-col justify-center items-center"
      show={show}
      onClose={onClose}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-10 py-8">
        <div className="absolute top-3 right-5">
          <IconButton
            className="hover:bg-neutral-100"
            onClick={(event) => {
              event.stopPropagation();
              onClose && onClose();
            }}
          >
            <IoClose className="text-3xl text-neutral-500" />
          </IconButton>
        </div>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold dark:font-extra bold text-2xl text-primary-400 dark:text-primary-500/70 -mt-2.5">
              Update cost type
            </div>

            <ErrorNotificationCard
              className="mt-3"
              show={!isLoading && isError}
              errorMessage={errorMessage}
            />

            <div
              className={clsx({
                "w-full": true,
                "mt-5": !isError,
                "mt-1.5": isError,
              })}
            >
              <TEInput
                autoFocus
                className="w-full"
                label="Cost type name"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.currentTarget.blur();
                  }
                }}
                {...register("costTypeName", { required: true })}
              />
              <InputValidationMessage
                show={dirtyFields.costTypeName || false}
                validateFn={() =>
                  CostTypeNameSchema.parse(watch("costTypeName"))
                }
              />
            </div>
          </div>

          <div className="mt-5 flex flex-row gap-3 w-full">
            <Button
              type="button"
              variant="tertiary"
              tabIndex={-1}
              className="font-bold w-[200px] p-3"
              onClick={() => {
                onClose && onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              tabIndex={-1}
              containerClassName="flex-1"
              className="p-3"
            >
              {!isLoading && "Update cost type"}
              {isLoading && (
                <CgSpinner className="m-auto text-lg animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
