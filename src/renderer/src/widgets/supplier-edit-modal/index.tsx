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
  Supplier,
  useUpdateSupplierMutation,
} from "../../providers/store/api/supplierApi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import { ErrorData } from "../../providers/store/api/type";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import clsx from "clsx";

type FormData = {
  supplierName: string;
};

const SupplierNameSchema = z
  .string()
  .min(5, "Supplier name length must be at least 5 characters")
  .max(50, "Supplier name length must be at most 50 characters");

export const UpdateSupplierSchema: ZodType<FormData> = z.object({
  supplierName: SupplierNameSchema,
});

interface Props {
  show: boolean;
  supplier: Supplier;
  onClose: () => any;
  onUpdateSuccessfully?: () => any;
}

export const SupplierEditModal: React.FC<Props> = ({
  show,
  supplier,
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
    resolver: zodResolver(UpdateSupplierSchema), // Apply the zodResolver
    defaultValues: {
      supplierName: supplier.name,
    },
  });

  // Reset
  useEffect(() => {
    reset();
  }, [show]);

  // Update form on external Supplier name change
  useEffect(() => {
    setValue("supplierName", supplier.name);
  }, [supplier]);

  // Update new supplier mutation
  const [updateSupplier, { isSuccess, isLoading, isError, error }] =
    useUpdateSupplierMutation();

  // On submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateSupplier({
      supplierId: supplier.supplierId,
      supplierName: data.supplierName,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Update supplier successfully!", { type: "success" });

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
              Update supplier
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
              {!isLoading && "Update supplier"}
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
