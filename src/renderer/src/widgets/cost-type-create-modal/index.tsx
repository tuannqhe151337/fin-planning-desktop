import React, { useEffect } from "react";
import { Modal } from "../../shared/modal";
import { IconButton } from "../../shared/icon-button";
import { IoClose } from "react-icons/io5";
import { Button } from "../../shared/button";
import { TEInput } from "tw-elements-react";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputValidationMessage } from "../../shared/validation-input-message";
import { useCreateCostTypeMutation } from "../../providers/store/api/costTypeAPI";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import clsx from "clsx";
import { useProcessError } from "@renderer/shared/utils/use-process-error";

type FormData = {
  costTypeName: string;
};

const CostTypeNameSchema = z
  .string()
  .min(5, "Cost type name length must be at least 5 characters")
  .max(50, "Cost type name length must be at most 50 characters");

export const CreateCostTypeSchema: ZodType<FormData> = z.object({
  costTypeName: CostTypeNameSchema,
});

interface Props {
  show: boolean;
  onClose: () => any;
  onCreateSuccessfully?: () => any;
}

export const CostTypeCreateModal: React.FC<Props> = ({
  show,
  onClose,
  onCreateSuccessfully,
}) => {
  // Form
  const {
    register,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(CreateCostTypeSchema), // Apply the zodResolver
  });

  // Reset
  useEffect(() => {
    reset();
  }, [show]);

  // Create new CostType mutation
  const [createCostType, { isSuccess, isLoading, isError, error }] =
    useCreateCostTypeMutation();

  // On submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    createCostType({ costTypeName: data.costTypeName });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Create cost type successfully!", { type: "success" });

      onCreateSuccessfully && onCreateSuccessfully();
    }
  }, [isLoading, isSuccess]);

  // Error message
  const errorMessage = useProcessError({ error, isError });

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
              Create cost type
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
              {!isLoading && "Create new cost type"}
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
