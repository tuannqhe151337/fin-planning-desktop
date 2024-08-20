import { IconButton } from "../../shared/icon-button";
import { Modal } from "../../shared/modal";
import { IoClose } from "react-icons/io5";
import { Variants, motion } from "framer-motion";
import { Button } from "../../shared/button";
import { useEffect, useMemo, useState } from "react";
import { TEInput } from "tw-elements-react";
import { z, ZodType } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTermBody,
  Duration,
  useCreateTermMutation,
  useGetListTermIntervalQuery,
} from "../../providers/store/api/termApi";
import { toast } from "react-toastify";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import { ErrorData } from "../../providers/store/api/type";
import { InputValidationMessage } from "../../shared/validation-input-message";
import { CgSpinner } from "react-icons/cg";
import { formatISODateForBody } from "../../shared/utils/format-iso-date-for-body";
import RadioCardOption from "../../entities/radio-card-option";
import { RadioInput } from "../../shared/radio-input";
import { DatePickerInputWithErrorAndLabel } from "../../entities/date-picker-input-with-error-and-label";
import { formatDate } from "../../shared/utils/format-date";
import { addDate } from "../../shared/utils/add-date";
import { Switch } from "../../shared/switch";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface Props {
  show: boolean;
  onClose: () => any;
}

const childrenAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

type FormData = {
  name: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  allowReupload?: boolean;
  reuploadStartDate?: Date;
  reuploadEndDate?: Date;
};

const NameSchema = z.string().min(1, "Name cannot be empty");

const DurationSchema = z.string();

const StartDateSchema = z.date({
  required_error: "Start date cannot be null",
});

const EndDateSchema = z
  .date({
    required_error: "End date cannot be null",
  })
  .refine((date) => new Date(date) > new Date(), {
    message: "Must be in the future",
  });

const AllowReuploadSchema = z.optional(z.boolean());

const ReuploadStartDateSchema = z.optional(
  z.date().refine((date) => new Date(date) > new Date(), {
    message: "Must be in the future",
  })
);
const ReuploadEndDateSchema = z.optional(
  z.date().refine((date) => new Date(date) > new Date(), {
    message: "Must be in the future",
  })
);

export const TermCreateModal: React.FC<Props> = ({ show, onClose }) => {
  // Select term duration state
  const [selectedOption, setSelectedOption] = useState<Duration>(
    Duration.MONTHLY
  );

  // Get term interval
  const { data: termInterval } = useGetListTermIntervalQuery();

  // Schema
  const CreateTermSchema: ZodType<FormData> = useMemo(() => {
    return z
      .object({
        name: NameSchema,
        duration: DurationSchema,
        startDate: StartDateSchema,
        endDate: EndDateSchema,
        allowReupload: AllowReuploadSchema,
        reuploadStartDate: ReuploadStartDateSchema,
        reuploadEndDate: ReuploadEndDateSchema,
      })
      .superRefine((data, ctx) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const reuploadStartDate = data.reuploadStartDate
          ? new Date(data.reuploadStartDate)
          : null;
        const reuploadEndDate = data.reuploadEndDate
          ? new Date(data.reuploadEndDate)
          : null;

        const monthOfStartDate = startDate.getMonth();
        const minimumStartDate = new Date(
          new Date().getFullYear(),
          monthOfStartDate,
          termInterval?.startTermDate
        );
        const maximumEndDate = addDate(minimumStartDate, {
          days: termInterval?.endTermInterval,
        });
        const minimumReuploadDate = addDate(minimumStartDate, {
          days: termInterval?.startReuploadInterval,
        });
        const maximumReuploadDate = addDate(minimumStartDate, {
          days:
            (termInterval?.startReuploadInterval || 0) +
            (termInterval?.endReuploadInterval || 0),
        });

        // Start date
        if (startDate < minimumStartDate || startDate > maximumEndDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Start date must be between 
            ${minimumStartDate.getDate()}/${minimumStartDate.getMonth() + 1} - 
          ${maximumEndDate.getDate()}/${maximumEndDate.getMonth() + 1}`,
            path: ["startDate"],
          });
        }

        // End date
        if (endDate <= startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after the start date",
            path: ["endDate"],
          });
        } else if (endDate < minimumStartDate || endDate > maximumEndDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `End date must be between 
            ${minimumStartDate.getDate()}/${minimumStartDate.getMonth() + 1} - 
          ${maximumEndDate.getDate()}/${maximumEndDate.getMonth() + 1}`,
            path: ["endDate"],
          });
        }

        if (data.allowReupload) {
          // Reupload start date
          if (
            reuploadStartDate &&
            reuploadStartDate <= new Date(data.endDate)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Reupload start date must be after end date",
              path: ["reuploadStartDate"],
            });
          } else if (
            reuploadStartDate &&
            reuploadStartDate < minimumReuploadDate &&
            reuploadStartDate > maximumReuploadDate
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Reupload start date must be between 
              ${minimumReuploadDate.getDate()}/${
                minimumReuploadDate.getMonth() + 1
              } - 
            ${maximumReuploadDate.getDate()}/${
                maximumReuploadDate.getMonth() + 1
              }`,
              path: ["reuploadEndDate"],
            });
          }

          // Reupload end date
          if (
            reuploadStartDate &&
            reuploadEndDate &&
            reuploadEndDate <= reuploadStartDate
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Reupload end date must be after reupload start date",
              path: ["reuploadEndDate"],
            });
          } else if (
            reuploadEndDate &&
            reuploadEndDate < minimumReuploadDate &&
            reuploadEndDate > maximumReuploadDate
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Reupload end date must be between 
              ${minimumReuploadDate.getDate()}/${
                minimumReuploadDate.getMonth() + 1
              } - 
            ${maximumReuploadDate.getDate()}/${
                maximumReuploadDate.getMonth() + 1
              }`,
              path: ["reuploadEndDate"],
            });
          }
        }
      });
  }, [termInterval]);

  // Form
  const {
    register,
    control,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(CreateTermSchema),
  });

  // i18n
  const { t } = useTranslation(["term-management"]);

  // Mutation
  const [createTerm, { isLoading, isSuccess, isError, error }] =
    useCreateTermMutation();

  // Handle submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const duration = Duration[data.duration as keyof typeof Duration];

    const body: CreateTermBody = {
      name: data.name,
      duration: duration,
      startDate: formatISODateForBody(data.startDate),
      endDate: formatISODateForBody(data.endDate),
      allowReupload: data.allowReupload || false,
    };

    if (data.reuploadStartDate) {
      body.reuploadStartDate = formatISODateForBody(data.reuploadStartDate);
    }

    if (data.reuploadEndDate) {
      body.reuploadEndDate = formatISODateForBody(data.reuploadEndDate);
    }

    createTerm(body);
  };

  // On success
  useEffect(() => {
    if (isSuccess) {
      toast("Create term successfully!", { type: "success" });
      onClose && onClose();
    }
  }, [isSuccess]);

  // Error message
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isError) {
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in (error.data as any)
      ) {
        setErrorMessage(
          uppercaseFirstCharacter((error.data as ErrorData).message)
        );
      } else {
        setErrorMessage("Something went wrong, please try again!");
      }
    }
  }, [isError]);

  useEffect(() => {
    if (isError) {
      toast(errorMessage, { type: "error" });
    }
  }, [isError, errorMessage]);

  // Default start date
  const defaultStartDate: Date = useMemo(() => {
    const currentDate = new Date();

    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      termInterval?.startTermDate
    );
  }, [termInterval]);

  // Handle on radio click
  function handleOnClickRadio(duration: Duration) {
    setSelectedOption(duration);
  }

  return (
    <Modal
      className="w-[70vw] xl:w-[66vw] h-max flex flex-col justify-center items-center"
      show={show}
      onClose={onClose}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-10 py-8">
        <div className="font-bold text-3xl text-primary-500">{t("Create term")}</div>

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

        <motion.div variants={childrenAnimation} className="w-11/12 mx-auto">
          <TEInput
            type="text"
            label={t("Term name")}
            className="bg-white dark:bg-neutral-900 custom-wrapper mt-8 border rounded font-bold opacity-70 "
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              } else if (e.key === "Enter") {
                handleSubmit(onSubmit)();
              }
            }}
            {...register("name", { required: true })}
          />
          <InputValidationMessage
            show={true}
            validateFn={() => NameSchema.parse(watch("name"))}
          />
        </motion.div>

        <div className="w-11/12 mx-auto mt-3">
          {/* Start - end date */}
          <div className="flex flex-row flex-wrap items-center gap-2">
            <motion.div variants={childrenAnimation}>
              <Controller
                name="startDate"
                control={control}
                render={({ field: { onChange } }) => (
                  <DatePickerInputWithErrorAndLabel
                    label={t("Start date")}
                    showValidationMessage={dirtyFields.startDate || false}
                    validateFn={() => {
                      const startDate = watch("startDate");

                      StartDateSchema.parse(startDate);

                      const monthOfStartDate = watch("startDate").getMonth();
                      const minimumStartDate = new Date(
                        startDate.getFullYear(),
                        monthOfStartDate,
                        termInterval?.startTermDate
                      );
                      const maximumEndDate = addDate(minimumStartDate, {
                        days: termInterval?.endTermInterval,
                      });

                      if (
                        startDate < minimumStartDate ||
                        startDate > maximumEndDate
                      ) {
                        if (startDate.getMonth() === 1) {
                          throw new Error(
                            `Must be between ${minimumStartDate.getDate()}/${
                              minimumStartDate.getMonth() + 1
                            } - ${maximumEndDate.getDate()}/${
                              maximumEndDate.getMonth() + 1
                            }`
                          );
                        } else {
                          throw new Error(
                            `Must be between day ${minimumStartDate.getDate()} - ${maximumEndDate.getDate()}`
                          );
                        }
                      }
                    }}
                    value={defaultStartDate}
                    onChange={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
            </motion.div>

            <p className="-mt-1.5 font-bold text-lg text-neutral-400">-</p>

            <motion.div variants={childrenAnimation}>
              <Controller
                name="endDate"
                control={control}
                render={({ field: { onChange } }) => (
                  <DatePickerInputWithErrorAndLabel
                    label={t("End date")}
                    showValidationMessage={dirtyFields.startDate || false}
                    validateFn={() => {
                      EndDateSchema.parse(watch("endDate"));

                      if (watch("endDate") < watch("startDate")) {
                        throw new Error("Must be after start date");
                      }

                      const monthOfStartDate = watch("startDate").getMonth();
                      const minimumStartDate = new Date(
                        watch("startDate").getFullYear(),
                        monthOfStartDate,
                        termInterval?.startTermDate
                      );
                      const maximumEndDate = addDate(minimumStartDate, {
                        days: termInterval?.endTermInterval,
                      });

                      if (
                        watch("endDate") < minimumStartDate ||
                        watch("endDate") > maximumEndDate
                      ) {
                        throw new Error(
                          `Must be between
                          ${minimumStartDate.getDate()}/${
                            minimumStartDate.getMonth() + 1
                          } - 
                          ${maximumEndDate.getDate()}/${
                            maximumEndDate.getMonth() + 1
                          }`
                        );
                      }
                    }}
                    value={addDate(defaultStartDate, { days: 5 })}
                    onChange={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
            </motion.div>
          </div>

          {/* Term duration radio boxes */}
          <motion.div
            className="flex flex-row gap-6 pt-3 w-full"
            variants={childrenAnimation}
          >
            <RadioCardOption
              radioInput={
                <RadioInput
                  value={Duration.MONTHLY}
                  checked={selectedOption === Duration.MONTHLY}
                  {...register("duration")}
                />
              }
              onClick={() => handleOnClickRadio(Duration.MONTHLY)}
              isSelected={selectedOption === Duration.MONTHLY}
              label={t("Monthly")}
              description={
                <>
                  {formatDate(watch("startDate"))} -{" "}
                  {formatDate(addDate(watch("startDate"), { months: 1 }))}
                </>
              }
            />

            <RadioCardOption
              disabled
              radioInput={
                <RadioInput
                  disabled
                  value={Duration.QUARTERLY}
                  checked={selectedOption === Duration.QUARTERLY}
                  {...register("duration")}
                />
              }
              // onClick={() => handleOnClickRadio(Duration.QUARTERLY)}
              // isSelected={selectedOption === Duration.QUARTERLY}
              tooltip="We'll complete this feature in the future"
              label={t("Quarterly")}
              description={
                <>
                  {formatDate(watch("startDate"))} -{" "}
                  {formatDate(addDate(watch("startDate"), { months: 3 }))}
                </>
              }
            />

            <RadioCardOption
              disabled
              radioInput={
                <RadioInput
                  disabled
                  value={Duration.HALF_YEARLY}
                  checked={selectedOption === Duration.HALF_YEARLY}
                  {...register("duration")}
                />
              }
              // onClick={() => handleOnClickRadio(Duration.HALF_YEARLY)}
              // isSelected={selectedOption === Duration.HALF_YEARLY}
              tooltip="We'll complete this feature in the future"
              label={t("Half year")}
              description={
                <>
                  {formatDate(watch("startDate"))} -{" "}
                  {formatDate(addDate(watch("startDate"), { months: 6 }))}
                </>
              }
            />
          </motion.div>

          <div className="border-b-2 border-b-neutral-100 dark:border-b-neutral-700 mt-4"></div>

          <div className="mt-2 flex flex-row flex-wrap items-center gap-1">
            <Controller
              name="allowReupload"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <Switch
                  size="lg"
                  checked={value || false}
                  onChange={(e) => onChange(e.currentTarget.checked)}
                  onBlur={onBlur}
                />
              )}
            />

            <div
              className={clsx({
                "-mt-0.5 text-base font-semibold duration-200": true,
                "text-neutral-500 dark:text-neutral-400":
                  watch("allowReupload"),
                "text-neutral-400 dark:text-neutral-500":
                  !watch("allowReupload"),
              })}
            >
              {t("Allow to reupload")}
            </div>
          </div>

          <div className="flex flex-row flex-wrap items-center mt-2 gap-2">
            {/* Reupload start date */}
            <motion.div variants={childrenAnimation}>
              <Controller
                name="reuploadStartDate"
                control={control}
                render={({ field: { onChange } }) => (
                  <DatePickerInputWithErrorAndLabel
                    label={t("Reupload start date")}
                    disabled={!watch("allowReupload")}
                    modalPosition={{
                      top: -100,
                      right: -320,
                    }}
                    showValidationMessage={
                      watch("allowReupload") &&
                      (dirtyFields.reuploadStartDate || false)
                    }
                    validateFn={() => {
                      const reuploadStartDate = watch("reuploadStartDate");

                      ReuploadStartDateSchema.parse(reuploadStartDate);

                      if (
                        reuploadStartDate &&
                        reuploadStartDate < watch("endDate")
                      ) {
                        throw new Error("Must be after end date");
                      }

                      const monthOfStartDate = watch("startDate").getMonth();
                      const minimumStartDate = new Date(
                        new Date().getFullYear(),
                        monthOfStartDate,
                        termInterval?.startTermDate
                      );
                      const minimumReuploadDate = addDate(minimumStartDate, {
                        days: termInterval?.startReuploadInterval,
                      });
                      const maximumReuploadDate = addDate(minimumStartDate, {
                        days:
                          (termInterval?.startReuploadInterval || 0) +
                          (termInterval?.endReuploadInterval || 0),
                      });

                      if (
                        reuploadStartDate &&
                        (reuploadStartDate < minimumReuploadDate ||
                          reuploadStartDate > maximumReuploadDate)
                      ) {
                        throw new Error(
                          `Must be between
                          ${minimumReuploadDate.getDate()}/${
                            minimumReuploadDate.getMonth() + 1
                          } - 
                          ${maximumReuploadDate.getDate()}/${
                            maximumReuploadDate.getMonth() + 1
                          }`
                        );
                      }
                    }}
                    value={addDate(defaultStartDate, { days: 20 })}
                    onChange={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
            </motion.div>

            <p
              className={clsx({
                "-mt-1.5 font-bold text-lg": true,
                "text-neutral-400": watch("allowReupload"),
                "text-neutral-300 dark:text-neutral-600":
                  !watch("allowReupload"),
              })}
            >
              -
            </p>

            {/* Reupload end date */}
            <motion.div variants={childrenAnimation}>
              <Controller
                name="reuploadEndDate"
                control={control}
                render={({ field: { onChange } }) => (
                  <DatePickerInputWithErrorAndLabel
                    label={t("Reupload end date")}
                    disabled={!watch("allowReupload")}
                    modalPosition={{
                      top: -100,
                      right: -320,
                    }}
                    showValidationMessage={
                      watch("allowReupload") &&
                      (dirtyFields.reuploadEndDate || false)
                    }
                    validateFn={() => {
                      const reuploadStartDate = watch("reuploadStartDate");
                      const reuploadEndDate = watch("reuploadEndDate");

                      ReuploadEndDateSchema.parse(watch("reuploadEndDate"));

                      if (
                        reuploadStartDate &&
                        reuploadEndDate &&
                        reuploadEndDate < reuploadStartDate
                      ) {
                        throw new Error("Must be after reupload start date");
                      }

                      const monthOfStartDate = watch("startDate").getMonth();
                      const minimumStartDate = new Date(
                        new Date().getFullYear(),
                        monthOfStartDate,
                        termInterval?.startTermDate
                      );
                      const minimumReuploadDate = addDate(minimumStartDate, {
                        days: termInterval?.startReuploadInterval,
                      });
                      const maximumReuploadDate = addDate(minimumStartDate, {
                        days:
                          (termInterval?.startReuploadInterval || 0) +
                          (termInterval?.endReuploadInterval || 0),
                      });

                      if (
                        reuploadEndDate &&
                        (reuploadEndDate < minimumReuploadDate ||
                          reuploadEndDate > maximumReuploadDate)
                      ) {
                        throw new Error(
                          `Must be between
                          ${minimumReuploadDate.getDate()}/${
                            minimumReuploadDate.getMonth() + 1
                          } - 
                          ${maximumReuploadDate.getDate()}/${
                            maximumReuploadDate.getMonth() + 1
                          }`
                        );
                      }
                    }}
                    value={addDate(defaultStartDate, { days: 21 })}
                    onChange={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap w-11/12 mt-3 gap-6">
          <Button
            disabled={!isValid}
            containerClassName="flex-1"
            className="font-bold p-3"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            {!isLoading && t("Create new term")}
            {isLoading && <CgSpinner className="m-auto text-lg animate-spin" />}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
