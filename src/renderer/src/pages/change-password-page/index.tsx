import { Variants, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { BubbleBackground } from "../../entities/bubble-background";
import { useChangePasswordUserMutation } from "../../providers/store/api/usersApi";
import { useEffect } from "react";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { InputValidationMessage } from "../../shared/validation-input-message";
import { Button } from "../../shared/button";
import { CgSpinner } from "react-icons/cg";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import { PasswordInput } from "../../shared/password-input";
import doimatkhauImg from "../../assets/images/doimatkhau.svg";

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

const imageAnimation: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const OldPasswordSchema = z.string().min(1, "Old password cannot be empty");

const NewPasswordSchema = z
  .string()
  // .min(8, "New password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Use 8 characters or more and include a mix of letters, numbers, and symbols",
  );

const ConfirmNewPasswordSchema = z
  .string()
  .min(1, "Confirm new password cannot be empty");

export const ChangePassWordSchema: ZodType<FormData> = z
  .object({
    oldPassword: OldPasswordSchema,
    newPassword: NewPasswordSchema,
    confirmNewPassword: ConfirmNewPasswordSchema,
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The confirm new password must be match with new password",
        path: ["confirmNewPassword"],
      });
    }
  });

export const ChangePasswordPage: React.FC = () => {
  const { t } = useTranslation(["change-password"]);

  // Navigate
  const navigate = useNavigate();

  // Get user detail
  // const { userId } = useParams<{ userId: string }>();

  // const [
  //   fetchUserDetail,
  //   { data: user, isFetching, isSuccess: isFetchUserDetailSuccess },
  // ] = useLazyFetchUserDetailQuery();

  // useEffect(() => {
  //   if (userId) {
  //     fetchUserDetail(parseInt(userId, 10), true);
  //   }
  // }, [userId]);

  // Form
  const {
    register,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(ChangePassWordSchema),
  });

  // Mutation
  const [changePassword, { isLoading, isSuccess, isError }] =
    useChangePasswordUserMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast("Change password successfully!", { type: "success" });
      navigate("/profile");
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-row flex-wrap w-full">
      <BubbleBackground />

      <div className="flex flex-row flex-wrap w-full">
        <div className="flex-1">
          <motion.div className="flex justify-center items-center dark:brightness-50">
            <motion.img
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              variants={imageAnimation}
              src={doimatkhauImg}
              alt=""
              className="h-[500px]"
            />
          </motion.div>
        </div>

        <div className="flex-1 z-10">
          <div className="flex justify-center items-center h-full">
            <motion.div
              className="w-[560px] "
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              variants={staggerChildrenAnimation}
            >
              <motion.div
                variants={childrenAnimation}
                className="mb-8 font-bold text-center text-3xl text-primary-500"
              >
                {t("changePassword")}
              </motion.div>

              <ErrorNotificationCard
                show={!isLoading && isError}
                errorMessage="Old password is not correct"
              />

              <motion.div variants={childrenAnimation}>
                <PasswordInput
                  label={t("oldPassword")}
                  className=" w-full bg-white dark:bg-neutral-900 "
                  size="lg"
                  autoFocus
                  {...register("oldPassword", { required: true })}
                />

                <InputValidationMessage
                  show={dirtyFields.oldPassword || false}
                  validateFn={() =>
                    OldPasswordSchema.parse(watch("oldPassword"))
                  }
                  className="mb-4"
                />
              </motion.div>

              <motion.div variants={childrenAnimation}>
                <PasswordInput
                  label={t("newPassword")}
                  className=" w-full bg-white dark:bg-neutral-900"
                  size="lg"
                  {...register("newPassword", { required: true })}
                />
                <InputValidationMessage
                  show={dirtyFields.oldPassword || false}
                  validateFn={() =>
                    NewPasswordSchema.parse(watch("newPassword"))
                  }
                  className="mb-4"
                />
              </motion.div>

              <motion.div variants={childrenAnimation}>
                <PasswordInput
                  label={t("confirmNewPassword")}
                  className="w-full bg-white dark:bg-neutral-900"
                  size="lg"
                  {...register("confirmNewPassword", { required: true })}
                />
                <InputValidationMessage
                  show={dirtyFields.oldPassword || false}
                  validateFn={() => {
                    ConfirmNewPasswordSchema.parse(watch("confirmNewPassword"));

                    if (watch("newPassword") !== watch("confirmNewPassword")) {
                      throw new Error(
                        "Confirm new password must equal new password",
                      );
                    }
                  }}
                  className="mb-4"
                />
              </motion.div>

              <motion.div className="mt-5" variants={childrenAnimation}>
                <Button
                  disabled={!isValid}
                  containerClassName="w-full"
                  className="font-bold"
                  onClick={() => {
                    handleSubmit(onSubmit)();
                  }}
                >
                  {!isLoading && <>{t("changeNewPassword")}</>}
                  {isLoading && (
                    <CgSpinner className="m-auto text-lg animate-spin" />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
