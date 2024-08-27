import { Variants, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { LanguageChanger } from "../../features/language-changer";
import { ThemeChanger } from "../../features/theme-changer";
import { DarkmodeChanger } from "../../features/darkmode-changer";
import { BubbleBackground } from "../../entities/bubble-background";
import Countdown from "react-countdown";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../shared/otp-input";
import { LogoRedirect } from "../../widgets/logo-redirect";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmail,
  selectEmailToken,
  setEmailToken,
  setOtpToken,
} from "../../providers/store/slices/forgotPasswordSlice";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  useForgotPasswordMutation,
  useOtpMutation,
} from "../../providers/store/api/usersApi";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { Button } from "../../shared/button";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import { useProcessError } from "../../shared/utils/use-process-error";
import { toast } from "react-toastify";

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
  otp: string;
};

const OtpSchema = z.string().length(6, "OTP must be 6 characters long");

export const OTPSchema: ZodType<FormData> = z.object({
  otp: OtpSchema,
});

export const OtpPage: React.FC = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation(["otp"]);

  // Navigate
  const navigate = useNavigate();

  const emailToken = useSelector(selectEmailToken);
  const email = useSelector(selectEmail);

  useEffect(() => {
    if (!email) {
      navigate(`/auth/forgot-password`);
    }
  }, [email]);

  // Form
  const {
    // register,
    formState: { isValid },
    handleSubmit,
    control,
    // setValue,
  } = useForm<FormData>({
    resolver: zodResolver(OTPSchema),
  });

  // OTP values
  // const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  // Mutation
  const [otp, { isLoading, data, isSuccess, isError, error }] =
    useOtpMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (emailToken) {
      otp({
        otp: data.otp,
        emailToken,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setOtpToken(data.token));
      navigate("/auth/reset-password");
    }
  }, [isSuccess]);

  // Use for resend OTP
  const [
    resendOTP,
    {
      data: resendOTPData,
      isSuccess: isResendOTPSuccess,
      error: resendOTPError,
      isError: isResendOTPError,
    },
  ] = useForgotPasswordMutation();

  useEffect(() => {
    if (isResendOTPSuccess) {
      dispatch(setEmailToken(resendOTPData.token));
      toast("Resend OTP successfully!", { type: "success" });
    }
  }, [isResendOTPSuccess]);

  // Error message
  const errorMessage = useProcessError({ error, isError });

  useProcessError({ error: resendOTPError, isError: isResendOTPError });

  return (
    <div className="flex flex-row flex-wrap w-full">
      <div className="flex flex-row flex-wrap items-center w-full z-20">
        <LogoRedirect to="/auth/login" />

        <div className="ml-auto flex flex-row flex-wrap items-center pr-10 z-20">
          <div className="ml-1.5">
            <LanguageChanger />
          </div>
          <ThemeChanger />
          <DarkmodeChanger />
        </div>
      </div>

      <BubbleBackground />

      <div className="flex flex-row flex-wrap w-full mt-16">
        <div className="flex-1">
          <motion.div className="flex justify-center items-center dark:brightness-50">
            <motion.img
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              variants={imageAnimation}
              src="/images/otp.svg"
              alt=""
              className="h-[440px]"
            />
          </motion.div>
        </div>

        <div className="flex-1 z-10 flex justify-center items-center">
          <motion.div
            className="w-[560px] flex flex-col items-center"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            variants={staggerChildrenAnimation}
          >
            <motion.div
              variants={childrenAnimation}
              className="mb-8 font-bold text-center text-3xl text-primary-500"
            >
              {t("otpConfirm")}
            </motion.div>

            <ErrorNotificationCard
              show={!isLoading && isError}
              errorMessage={errorMessage}
            />

            <motion.div variants={childrenAnimation}>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.currentTarget.blur();
                      } else if (e.key === "Enter") {
                        handleSubmit(onSubmit)();
                      }
                    }}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </motion.div>

            <div className="w-full mt-3 -ml-44">
              <Countdown
                className="block ml-auto w-max font-semibold text-neutral-400"
                key={resendOTPData?.token}
                date={
                  Date.now() +
                  parseInt(import.meta.env.VITE_OTP_DURATION) * 1000
                }
              />
            </div>

            <motion.div className="mt-5 w-full" variants={childrenAnimation}>
              <Button
                disabled={!isValid}
                containerClassName="w-full"
                className="font-bold"
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                {!isLoading && <>{t("confirm")}</>}
                {isLoading && (
                  <CgSpinner className="m-auto text-lg animate-spin" />
                )}
              </Button>
            </motion.div>

            <motion.div
              className="w-full flex justify-end"
              variants={childrenAnimation}
            >
              <p
                className="mt-4 font-bold underline block text-primary-500 transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600 cursor-pointer"
                onClick={() => {
                  email && resendOTP({ email });
                }}
              >
                {t("resendOTP")}
              </p>
            </motion.div>
          </motion.div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
