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
import { useCreateSupplierMutation } from "../../providers/store/api/supplierApi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import { ErrorData } from "../../providers/store/api/type";
import clsx from "clsx";

type FormData = {
  supplierName: string;
};

const SupplierNameSchema = z
  .string()
  .min(5, "Supplier name length must be at least 5 characters")
  .max(50, "Supplier name length must be at most 50 characters");

export const CreateSupplierSchema: ZodType<FormData> = z.object({
  supplierName: SupplierNameSchema,
});

interface Props {
  show: boolean;
  onClose: () => any;
  onCreateSuccessfully?: () => any;
}

export const SupplierCreateModal: React.FC<Props> = ({
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
    resolver: zodResolver(CreateSupplierSchema), // Apply the zodResolver
  });

  // Reset
  useEffect(() => {
    reset();
  }, [show]);

  // Create new supplier mutation
  const [createSupplier, { isSuccess, isLoading, isError, error }] =
    useCreateSupplierMutation();

  // On submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    createSupplier({ supplierName: data.supplierName });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Create supplier successfully!", { type: "success" });

      onCreateSuccessfully && onCreateSuccessfully();
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
              Create supplier
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
                label="Supplier name"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.currentTarget.blur();
                  }
                }}
                {...register("supplierName", { required: true })}
              />
              <InputValidationMessage
                show={dirtyFields.supplierName || false}
                validateFn={() =>
                  SupplierNameSchema.parse(watch("supplierName"))
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
              {!isLoading && "Create new Supplier"}
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
