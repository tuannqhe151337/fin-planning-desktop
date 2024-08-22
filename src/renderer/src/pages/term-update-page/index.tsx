import { useEffect, useMemo, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { Variants, motion } from "framer-motion";
import { z, ZodType } from "zod";
import {
  Duration,
  UpdateTermBody,
  useGetListTermIntervalQuery,
  useLazyFetchTermDetailQuery,
  useUpdateTermMutation,
} from "../../providers/store/api/termApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Role } from "../../providers/store/api/type";
import { TEInput } from "tw-elements-react";
import { InputValidationMessage } from "../../shared/validation-input-message";
import RadioCardOption from "../../entities/radio-card-option";
import { RadioInput } from "../../shared/radio-input";
import { CgSpinner } from "react-icons/cg";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";
import { formatISODateForBody } from "../../shared/utils/format-iso-date-for-body";
import { DatePickerInputWithErrorAndLabel } from "../../entities/date-picker-input-with-error-and-label";
import { InputSkeleton } from "../../shared/input-skeleton";
import { formatDate } from "../../shared/utils/format-date";
import { addDate } from "../../shared/utils/add-date";
import { useDetectDarkmode } from "../../shared/hooks/use-detect-darkmode";
import clsx from "clsx";
import { Switch } from "../../shared/switch";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { useTranslation } from "react-i18next";
import { useProcessError } from "@renderer/shared/utils/use-process-error";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

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

const DurationSchema = z.nativeEnum(Duration);

const StartDateSchema = z.date({
  required_error: "Start date cannot be null",
});

const EndDateSchema = z.date({
  required_error: "End date cannot be null",
});

const AllowReuploadSchema = z.optional(z.boolean());

const ReuploadStartDateSchema = z.optional(z.date());
const ReuploadEndDateSchema = z.optional(z.date());

export const TermUpdate: React.FC = () => {
  // i18n
  const { t } = useTranslation(["term-management"]);

  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT]);

  // Navigate
  const navigate = useNavigate();

  // Get term interval
  const { data: termInterval } = useGetListTermIntervalQuery();

  // Select term duration state
  const [selectedOption, setSelectedOption] = useState<Duration>();

  // Schema
  const UpdateTermSchema: ZodType<FormData> = useMemo(() => {
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
          termInterval?.startTermDate,
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

  // Get term detail
  const { termId } = useParams<{ termId: string }>();

  const [
    fetchTermDetail,
    { data: term, isFetching, isSuccess: isFetchTermDetailSuccess },
  ] = useLazyFetchTermDetailQuery();

  useEffect(() => {
    if (termId) {
      fetchTermDetail(parseInt(termId, 10), true);
    }
  }, [termId]);

  // Form
  const {
    register,
    control,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(UpdateTermSchema), // Apply the zodResolver
  });

  useEffect(() => {
    if (!isFetching && isFetchTermDetailSuccess && term) {
      setValue("name", term.name);
      setValue("duration", term.duration);
      setValue("startDate", parseISOInResponse(term.startDate));
      setValue("endDate", parseISOInResponse(term.endDate));
      setValue("allowReupload", term.allowReupload);
      setValue("reuploadStartDate", parseISOInResponse(term.reuploadStartDate));
      setValue("reuploadEndDate", parseISOInResponse(term.reuploadEndDate));

      setSelectedOption(term.duration as Duration);
    }
  }, [isFetching, isFetchTermDetailSuccess, term]);

  // Mutation update term
  const [updateTerm, { isLoading, isSuccess, isError, error }] =
    useUpdateTermMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      const duration = Duration[data.duration as keyof typeof Duration];

      const body: UpdateTermBody = {
        id: termId ? parseInt(termId) : 0,
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

      updateTerm(body);
    } catch (_) {
      toast("Please reload the page and try again!", { type: "error" });
    }
  };

  // Detect darkmode
  const isDarkmode = useDetectDarkmode();

  // On success
  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Update term successfully!", {
        type: "success",
        theme: isDarkmode ? "dark" : "light",
      });

      navigate("/term-management");
    }
  }, [isLoading, isSuccess]);

  // Error message
  const errorMessage = useProcessError({ error, isError });

  useEffect(() => {
    if (isError) {
      toast(errorMessage, {
        type: "error",

        theme: isDarkmode ? "dark" : "light",
      });
    }
  }, [isError, errorMessage]);

  // Handle on radio click
  function handleOnClickRadio(duration: Duration) {
    setSelectedOption(duration);
  }

  return (
    <motion.div
      className="px-6 pb-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      {/* Banner */}
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto z-10">
          <p className="text-primary dark:text-primary/70 font-extrabold text-lg w-fit ml-7 space-x-2">
            <Link
              to={`../../term-management`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              {t("Term management")}
            </Link>
            <span className="text-base opacity-40">&gt;</span>
            <Link
              to={`/term-management/detail/information/${termId}`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              {t("Term detail")}
            </Link>
            <span className="text-base opacity-40">&gt;</span>
            <span>
              {t("Update")} {term?.name}
            </span>
          </p>
        </div>
      </BubbleBanner>

      <div className="border px-10 pb-12 mt-10 rounded-lg dark:border-neutral-800 dark:shadow-black flex flex-col">
        {/* Term name */}
        <motion.div variants={childrenAnimation} className="">
          <TEInput
            type="text"
            label={t("Term name")}
            className="bg-white dark:bg-neutral-900 custom-wrapper mt-8 border rounded font-bold opacity-70 "
            autoFocus
            {...register("name", { required: true })}
          />
          <InputValidationMessage
            show={true}
            validateFn={() => NameSchema.parse(watch("name"))}
          />
        </motion.div>

        {/* Start - end date */}
        <div className="flex flex-row flex-wrap items-center gap-2 mt-3">
          <motion.div variants={childrenAnimation}>
            <InputSkeleton
              containerClassName="w-[200px]"
              skeletonClassName="w-[200px]"
              showSkeleton={isFetching}
              showInput={!isFetching && isFetchTermDetailSuccess}
            >
              <Controller
                name="startDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {value && (
                      <DatePickerInputWithErrorAndLabel
                        label={t("Start date")}
                        showValidationMessage={dirtyFields.startDate || false}
                        validateFn={() => {
                          const startDate = watch("startDate");

                          StartDateSchema.parse(startDate);

                          const monthOfStartDate =
                            watch("startDate").getMonth();
                          const minimumStartDate = new Date(
                            startDate.getFullYear(),
                            monthOfStartDate,
                            termInterval?.startTermDate,
                          );
                          const maximumEndDate = addDate(minimumStartDate, {
                            days: termInterval?.endTermInterval,
                          });

                          if (
                            startDate < minimumStartDate ||
                            startDate > maximumEndDate
                          ) {
                            if (startDate.getMonth() === 2) {
                              throw new Error(
                                `Must be between ${minimumStartDate.getDate()}/${
                                  minimumStartDate.getMonth() + 1
                                } - ${maximumEndDate.getDate()}/${
                                  maximumEndDate.getMonth() + 1
                                }`,
                              );
                            } else {
                              throw new Error(
                                `Must be between day ${minimumStartDate.getDate()} - ${maximumEndDate.getDate()}`,
                              );
                            }
                          }
                        }}
                        value={value}
                        onChange={(value) => {
                          onChange(value);
                        }}
                      />
                    )}
                  </>
                )}
              />
            </InputSkeleton>
          </motion.div>

          <motion.p
            className="mt-1.5 font-bold text-lg text-neutral-400"
            variants={childrenAnimation}
          >
            -
          </motion.p>

          <motion.div variants={childrenAnimation}>
            <InputSkeleton
              containerClassName="w-[200px]"
              skeletonClassName="w-[200px]"
              showSkeleton={isFetching}
              showInput={!isFetching && isFetchTermDetailSuccess}
            >
              <Controller
                name="endDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {value && (
                      <DatePickerInputWithErrorAndLabel
                        label={t("End date")}
                        showValidationMessage={dirtyFields.startDate || false}
                        validateFn={() => {
                          EndDateSchema.parse(watch("endDate"));

                          if (watch("endDate") < watch("startDate")) {
                            throw new Error("Must be after start date");
                          }

                          const minimumStartDate = new Date(
                            watch("startDate").getFullYear(),
                            watch("startDate").getMonth(),
                            termInterval?.startTermDate,
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
                          }`,
                            );
                          }
                        }}
                        value={value}
                        onChange={(value) => {
                          onChange(value);
                        }}
                      />
                    )}
                  </>
                )}
              />
            </InputSkeleton>
          </motion.div>
        </div>

        {/* Radio buttons */}
        <motion.div
          className="flex flex-row gap-6 pt-10 w-full"
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

        <motion.div
          className="mt-2 flex flex-row flex-wrap items-center gap-1"
          variants={childrenAnimation}
        >
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
              "text-neutral-500 dark:text-neutral-400": watch("allowReupload"),
              "text-neutral-400 dark:text-neutral-500": !watch("allowReupload"),
            })}
          >
            {t("Allow to reupload")}
          </div>
        </motion.div>

        {/* Reupload start - reupload end date */}
        <div className="flex flex-row flex-wrap items-center gap-2 mt-4">
          {/* Reupload start date */}
          <motion.div variants={childrenAnimation}>
            <InputSkeleton
              containerClassName="w-[200px]"
              skeletonClassName="w-[200px]"
              showSkeleton={isFetching}
              showInput={!isFetching && isFetchTermDetailSuccess}
            >
              <Controller
                name="reuploadStartDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {value && (
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

                          const monthOfStartDate =
                            watch("startDate").getMonth();
                          const minimumStartDate = new Date(
                            new Date().getFullYear(),
                            monthOfStartDate,
                            termInterval?.startTermDate,
                          );
                          const minimumReuploadDate = addDate(
                            minimumStartDate,
                            {
                              days: termInterval?.startReuploadInterval,
                            },
                          );
                          const maximumReuploadDate = addDate(
                            minimumStartDate,
                            {
                              days:
                                (termInterval?.startReuploadInterval || 0) +
                                (termInterval?.endReuploadInterval || 0),
                            },
                          );

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
                          }`,
                            );
                          }
                        }}
                        value={value}
                        onChange={(value) => {
                          onChange(value);
                        }}
                      />
                    )}
                  </>
                )}
              />
            </InputSkeleton>
          </motion.div>

          <motion.p
            className="mt-1.5 font-bold text-lg text-neutral-400"
            variants={childrenAnimation}
          >
            -
          </motion.p>

          {/* Reupload end date */}
          <motion.div variants={childrenAnimation}>
            <InputSkeleton
              containerClassName="w-[200px]"
              skeletonClassName="w-[200px]"
              showSkeleton={isFetching}
              showInput={!isFetching && isFetchTermDetailSuccess}
            >
              <Controller
                name="reuploadEndDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {value && (
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
                            throw new Error(
                              "Must be after reupload start date",
                            );
                          }

                          const monthOfStartDate =
                            watch("startDate").getMonth();
                          const minimumStartDate = new Date(
                            new Date().getFullYear(),
                            monthOfStartDate,
                            termInterval?.startTermDate,
                          );
                          const minimumReuploadDate = addDate(
                            minimumStartDate,
                            {
                              days: termInterval?.startReuploadInterval,
                            },
                          );
                          const maximumReuploadDate = addDate(
                            minimumStartDate,
                            {
                              days:
                                (termInterval?.startReuploadInterval || 0) +
                                (termInterval?.endReuploadInterval || 0),
                            },
                          );

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
                          }`,
                            );
                          }
                        }}
                        value={value}
                        onChange={(value) => {
                          onChange(value);
                        }}
                      />
                    )}
                  </>
                )}
              />
            </InputSkeleton>
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div
          className="flex flex-row flex-wrap items-center gap-5 mt-12 "
          variants={childrenAnimation}
        >
          <Button
            variant="tertiary"
            className="w-[300px] p-3 font-bold border-primary-200"
            onClick={() => {
              navigate(`/term-management/detail/information/${term?.id}`);
            }}
          >
            {t("Back")}
          </Button>
          <Button
            disabled={!isValid}
            containerClassName="flex-1"
            className="font-bold p-3 h-[51px]"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            {!isLoading && t("Update term")}
            {isLoading && <CgSpinner className="m-auto text-lg animate-spin" />}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
