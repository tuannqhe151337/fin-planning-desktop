import { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { FaCircleExclamation, FaLocationDot, FaUser } from "react-icons/fa6";
import { Variants, motion } from "framer-motion";
import { TEInput } from "tw-elements-react";
import { FaBirthdayCake, FaPhoneAlt } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { PiBagSimpleFill, PiTreeStructureFill } from "react-icons/pi";
import { DatePickerInput } from "../../shared/date-picker-input";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z, ZodType } from "zod";
import {
  useLazyFetchUserDetailQuery,
  useUpdateUserMutation,
} from "../../providers/store/api/usersApi";
import { parseISO } from "date-fns";
import { DepartmentFilter } from "../../entities/department-filter";
import { InputValidationMessage } from "../../shared/validation-input-message";
import { MdEmail } from "react-icons/md";
import { allowOnlyNumber } from "../../shared/utils/allow-only-number";
import { RoleFilter } from "../../entities/role-filter";
import { PositionFilter } from "../../entities/position-filter";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { Role } from "../../providers/store/api/type";
import { InputSkeleton } from "../../shared/input-skeleton";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";
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

const errorAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    height: 0,
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    height: 45,
    opacity: 1,
  },
};

type Id = number;

type FormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  birthDate: Date;
  departmentId: Id;
  roleId: Id;
  positionId: Id;
  address?: string | null;
};

const FullNameSchema = z
  .string()
  .regex(
    /^[\p{L}\s]{5,}$/u,
    "Full name should be at least 5 characters long and should not contain special characters",
  );

const PhoneNumberSchema = z
  .string()
  .regex(/^[0-9]+$/)
  .min(10, "Phone number must be at least 10 numbers")
  .max(15, "Phone number must be at least 15 numbers");

const EmailSchema = z.string().email();

const PositionIdSchema = z.number().gt(0, "Please choose a position");

const DepartmentIdSchema = z.number().gt(0, "Please choose a department");

const AddressSchema = z.string().nullable();

const RoleIdSchema = z.number().gt(0, "Please choose a role");

const BirthDateSchema = z.date();

export const CreateUserSchema: ZodType<FormData> = z.object({
  fullName: FullNameSchema,
  phoneNumber: PhoneNumberSchema,
  email: EmailSchema,
  birthDate: BirthDateSchema,
  roleId: RoleIdSchema,
  positionId: PositionIdSchema,
  departmentId: DepartmentIdSchema,
  address: AddressSchema,
});

export const UserEditPage: React.FC = () => {
  // i18n
  const { t } = useTranslation(["user-detail"]);

  // Authorized
  usePageAuthorizedForRole([Role.ADMIN]);

  // Navigate
  const navigate = useNavigate();

  // Get user detail
  const { userId } = useParams<{ userId: string }>();

  const [
    fetchUserDetail,
    { data: user, isFetching, isSuccess: isFetchUserDetailSuccess },
  ] = useLazyFetchUserDetailQuery();

  useEffect(() => {
    if (userId) {
      fetchUserDetail(parseInt(userId, 10), true);
    }
  }, [userId]);

  // Form
  const {
    register,
    control,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema), // Apply the zodResolver
  });

  useEffect(() => {
    if (!isFetching && isFetchUserDetailSuccess && user) {
      setValue("fullName", user.fullName);
      setValue("phoneNumber", user.phoneNumber);
      setValue("email", user.email);
      setValue("birthDate", parseISO(user.dob, { additionalDigits: 2 }));
      setValue("departmentId", user.department.id);
      setValue("roleId", user.role.id);
      setValue("positionId", user.position.id);
      setValue("address", user.address);
    }
  }, [isFetching, isFetchUserDetailSuccess, user]);

  // Mutation update user
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const birthDateString = data.birthDate.toISOString().replace("Z", "");

    if (userId) {
      const numericUserId = parseInt(userId, 10);

      updateUser({
        id: numericUserId,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        departmentId: data.departmentId,
        roleId: data.roleId,
        positionId: data.positionId,
        dob: birthDateString,
        address: data.address || "",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Update user successfully!", { type: "success" });

      navigate("/user-management");
    }
  }, [isLoading, isSuccess]);

  // Error message
  const errorMessage = useProcessError({ error, isError });

  useEffect(() => {
    if (isError) {
      toast(errorMessage, { type: "error" });
    }
  }, [isError, errorMessage]);

  return (
    <motion.div
      className="px-6 pb-32"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      {/* Banner */}
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto z-10">
          <p className="text-primary dark:text-primary/70 font-extrabold text-lg w-fit ml-7 space-x-2">
            <Link
              to={`/user-management`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              {t("User management")}
            </Link>
            <span className="text-base opacity-40">&gt;</span>
            <Link
              to={`/user-management/detail/${userId}`}
              className="font-bold opacity-70 hover:opacity-100 hover:underline duration-200"
            >
              {user?.username}
            </Link>
            <span className="text-base opacity-40">&gt;</span>
            <span>{t("Update user")}</span>
          </p>
        </div>
      </BubbleBanner>

      <motion.div
        className="mt-5 mb-5"
        initial={AnimationStage.HIDDEN}
        animate={isError ? AnimationStage.VISIBLE : AnimationStage.HIDDEN}
        variants={errorAnimation}
      >
        <div className="flex flex-row flex-wrap items-center p-3 gap-3 bg-red-400/30 dark:bg-red-800/30 rounded-lg w-full">
          <FaCircleExclamation className="text-red-500 dark:text-red-600" />
          <p className="text-sm text-red-600 dark:text-red-500 font-semibold">
            {errorMessage}
          </p>
        </div>
      </motion.div>

      <div className="border pb-12 rounded-lg dark:border-neutral-800 dark:shadow-black ">
        <div className="flex flex-row justify-around">
          {/* Fullname */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <FaUser className="text-2xl mt-2 opacity-30" />
            </div>
            <motion.div variants={childrenAnimation}>
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="w-[440px] !static"
              >
                <TEInput
                  type="text"
                  label={t("Full name")}
                  className="mb-4 font-semibold !text-neutral-500 bg-white dark:bg-neutral-900"
                  autoFocus
                  {...register("fullName", { required: true })}
                />
                <InputValidationMessage
                  className="-mt-3"
                  show={dirtyFields.fullName || false}
                  validateFn={() => FullNameSchema.parse(watch("fullName"))}
                />
              </InputSkeleton>
            </motion.div>
          </div>

          {/* Role */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <RiUserSettingsFill className="text-2xl mt-2 opacity-30" />
            </div>
            <motion.div variants={childrenAnimation}>
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="!static"
              >
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <RoleFilter
                      defaultOption={{
                        value: user!.role.id,
                        label: user!.role.name,
                      }}
                      onChange={(option) => option && onChange(option.value)}
                      className="z-40 dark:z-40 w-[440px]"
                    />
                  )}
                />
                <InputValidationMessage
                  className="mt-1"
                  show={dirtyFields.roleId || false}
                  validateFn={() => RoleIdSchema.parse(watch("roleId"))}
                />
              </InputSkeleton>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-row justify-around">
          {/* Phone */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <FaPhoneAlt className="text-2xl mt-2 opacity-30 " />
            </div>
            <motion.div variants={childrenAnimation}>
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="w-[440px] !static"
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, ...props } }) => (
                    <TEInput
                      label={t("Phone")}
                      className="mb-4 w-full font-semibold !text-neutral-500 bg-white dark:bg-neutral-900"
                      onChange={(e) => {
                        onChange(allowOnlyNumber(e.currentTarget.value));
                      }}
                      {...props}
                    />
                  )}
                />
                <InputValidationMessage
                  className="-mt-3"
                  show={dirtyFields.phoneNumber || false}
                  validateFn={() =>
                    PhoneNumberSchema.parse(watch("phoneNumber"))
                  }
                />
              </InputSkeleton>
            </motion.div>
          </div>

          {/* Department */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <PiTreeStructureFill className="text-2xl mt-2 opacity-30" />
            </div>
            <motion.div variants={childrenAnimation}>
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="!static"
              >
                <Controller
                  name="departmentId"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <DepartmentFilter
                      className="z-30 dark:z-30 w-[440px]"
                      defaultOption={{
                        value: user!.department.id,
                        label: user!.department.name,
                      }}
                      onChange={(option) => option && onChange(option.value)}
                    />
                  )}
                />
                <InputValidationMessage
                  className="mt-1"
                  show={dirtyFields.departmentId || false}
                  validateFn={() =>
                    DepartmentIdSchema.parse(watch("departmentId"))
                  }
                />
              </InputSkeleton>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-row justify-around">
          {/* Email */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <MdEmail className="text-2xl mt-1 opacity-30" />
            </div>
            <motion.div variants={childrenAnimation}>
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="w-[440px] !static"
              >
                <TEInput
                  type="email"
                  label={t("Email")}
                  className="mb-4 w-full font-semibold !text-neutral-500 bg-white dark:bg-neutral-900"
                  {...register("email", { required: true })}
                />
                <InputValidationMessage
                  className="-mt-3"
                  show={dirtyFields.email || false}
                  validateFn={() => EmailSchema.parse(watch("email"))}
                />
              </InputSkeleton>
            </motion.div>
          </div>

          {/* Position */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <PiBagSimpleFill className="text-2xl mt-2 opacity-30" />
            </div>
            <motion.div variants={childrenAnimation}>
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="!static"
              >
                <Controller
                  name="positionId"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <PositionFilter
                      className="z-20 dark:z-20 w-[440px]"
                      defaultOption={{
                        value: user!.position.id,
                        label: user!.position.name,
                      }}
                      onChange={(option) => option && onChange(option.value)}
                    />
                  )}
                />
                <InputValidationMessage
                  className="mt-1"
                  show={dirtyFields.positionId || false}
                  validateFn={() => PositionIdSchema.parse(watch("positionId"))}
                />
              </InputSkeleton>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-row justify-around">
          {/* Address */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <FaLocationDot className="text-2xl mt-1 opacity-30" />
            </div>
            <motion.div variants={childrenAnimation}>
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="w-[440px] static"
              >
                <TEInput
                  type="text"
                  label={t("Address")}
                  className="mb-4 w-full font-semibold !text-neutral-500 bg-white dark:bg-neutral-900"
                  {...register("address")}
                />
              </InputSkeleton>
            </motion.div>
          </div>

          {/* Birthdate */}
          <div className="flex flex-row gap-6 pt-10">
            <div>
              <FaBirthdayCake className="text-2xl mt-1 opacity-30" />
            </div>
            <motion.div variants={childrenAnimation} className="custom-wrapper">
              <InputSkeleton
                showSkeleton={isFetching}
                showInput={!isFetching && isFetchUserDetailSuccess}
                className="!static"
              >
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      value={parseISOInResponse(user?.dob)}
                      onChange={(value) => onChange(value)}
                      className="w-[440px]"
                    />
                  )}
                />
              </InputSkeleton>
            </motion.div>
          </div>
        </div>

        <div className="mx-14 flex justify-center mt-8">
          <Button
            disabled={!isValid}
            containerClassName="w-full"
            className="py-2 dark:text-white/80"
            onClick={handleSubmit(onSubmit)}
          >
            {!isLoading && t("Update user")}
            {isLoading && <CgSpinner className="m-auto text-lg animate-spin" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
