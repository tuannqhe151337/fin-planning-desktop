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
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import { AFFIX } from "../../providers/store/api/type";
import clsx from "clsx";
import RadioCardOption from "../../entities/radio-card-option";
import { RadioInput } from "../../shared/radio-input";
import { useCreateCurrencyMutation } from "../../providers/store/api/currencyApi";
import { useProcessError } from "@renderer/shared/utils/use-process-error";

type FormData = {
  currencyName: string;
  currencySymbol?: string;
  affix?: AFFIX;
};

const CurrencyNameSchema = z
  .string()
  .min(1, "Currency name length can not be null")
  .max(50, "Currency name length must be at most 50 characters");

const CurrencySymbolSchema = z.optional(z.string());

const AffixSchema = z.optional(z.nativeEnum(AFFIX));

export const CreateCurrencySchema: ZodType<FormData> = z.object({
  currencyName: CurrencyNameSchema,
  currencySymbol: CurrencySymbolSchema,
  affix: AffixSchema,
});

interface Props {
  show: boolean;
  onClose: () => any;
  onCreateSuccessfully?: () => any;
}

export const CurrencyCreateModal: React.FC<Props> = ({
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
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(CreateCurrencySchema), // Apply the zodResolver
    values: {
      currencyName: "",
      affix: AFFIX.PREFIX,
    },
  });

  // Reset
  useEffect(() => {
    reset();
  }, [show]);

  // Create new department mutation
  const [createCurrency, { isSuccess, isLoading, isError, error }] =
    useCreateCurrencyMutation();

  // On submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    createCurrency({
      currencyName: data.currencyName,
      currencySymbol: data.currencySymbol,
      currencyAffix: data.affix,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Add new currency successfully!", { type: "success" });

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
              Add new currency
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
              {/* Currency name */}
              <div>
                <TEInput
                  autoFocus
                  className="w-full"
                  label="Currency name"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.currentTarget.blur();
                    }
                  }}
                  {...register("currencyName", { required: true })}
                />
                <InputValidationMessage
                  show={dirtyFields.currencyName || false}
                  validateFn={() =>
                    CurrencyNameSchema.parse(watch("currencyName"))
                  }
                />
              </div>

              {/* Currency symbol */}
              <div className="mt-3">
                <TEInput
                  className="w-full"
                  label="Symbol"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.currentTarget.blur();
                    }
                  }}
                  {...register("currencySymbol")}
                />
              </div>

              {/* Currency prefix suffix */}
              <div className="flex flex-row gap-5 mt-5">
                <RadioCardOption
                  isSelected={watch("affix") === AFFIX.PREFIX}
                  radioInput={
                    <RadioInput value={AFFIX.PREFIX} {...register("affix")} />
                  }
                  label={"Prefix"}
                  description={`Eg: ${
                    watch("currencySymbol") ? watch("currencySymbol") : "$"
                  }40`}
                  onClick={() => {
                    setValue("affix", AFFIX.PREFIX);
                  }}
                />
                <RadioCardOption
                  isSelected={watch("affix") === AFFIX.SUFFIX}
                  radioInput={
                    <RadioInput value={AFFIX.SUFFIX} {...register("affix")} />
                  }
                  label={"Suffix"}
                  description={`Eg: 40.000${
                    watch("currencySymbol") ? watch("currencySymbol") : "đ"
                  }`}
                  onClick={() => {
                    setValue("affix", AFFIX.SUFFIX);
                  }}
                />
              </div>
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
              {!isLoading && "Add new currency"}
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
