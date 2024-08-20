import { useEffect, useState } from "react";
import { TERipple, TEInput } from "tw-elements-react";
import { Variants, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LanguageChanger } from "../../features/language-changer";
import { ThemeChanger } from "../../features/theme-changer";
import { DarkmodeChanger } from "../../features/darkmode-changer";
import { BubbleBackground } from "../../entities/bubble-background";
import { Button } from "../../shared/button";
import {
  useLazyMeQuery,
  useLoginMutation,
} from "../../providers/store/api/authApi";
import { CgSpinner } from "react-icons/cg";
import { ErrorData, LocalStorageItemKey } from "../../providers/store/api/type";
import { LogoRedirect } from "../../widgets/logo-redirect";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import { PasswordInput } from "../../shared/password-input";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputValidationMessage } from "../../shared/validation-input-message";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import lamviecImg from "../../assets/images/lamviec.svg";

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

interface FormData {
  email: string;
  password: string;
}

const EmailSchema = z.string().email();
const PasswordSchema = z.string();

export const LoginSchema: ZodType<FormData> = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const LoginPage: React.FC = () => {
  // Navigate
  const navigate = useNavigate();

  // Use translation
  const { t } = useTranslation(["login"]);

  // Form
  const {
    register,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema), // Apply the zodResolver
  });

  // Redirect if user already logged in
  const [
    getMeQuery,
    {
      isSuccess: meQuerySuccess,
      isFetching: meQueryFetching,
      isError: meQueryError,
    },
  ] = useLazyMeQuery();

  useEffect(() => {
    getMeQuery();
  }, []);

  useEffect(() => {
    if (!meQueryFetching && meQuerySuccess && !meQueryError) {
      navigate("/");
    }
  }, [meQueryFetching, meQuerySuccess, meQueryError]);

  // Mutation
  const [login, { data, isLoading, isError, isSuccess, error }] =
    useLoginMutation();

  // Handling submit
  const onSubmit: SubmitHandler<FormData> = ({ email, password }) => {
    login({
      email,
      password,
    });
  };

  // Success
  useEffect(() => {
    if (isSuccess) {
      if (data) {
        localStorage.setItem(LocalStorageItemKey.TOKEN, data.token);
        localStorage.setItem(
          LocalStorageItemKey.REFRESH_TOKEN,
          data.refreshToken,
        );
      }

      navigate("/");
    }
  }, [isSuccess]);

  // Error message
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isError) {
      if (error && "data" in error && "message" in (error.data as any)) {
        setErrorMessage(
          uppercaseFirstCharacter((error.data as ErrorData).message),
        );
      } else {
        setErrorMessage("Something went wrong, please try again!");
      }
    }
  }, [isError]);

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

      <div className="flex flex-row flex-wrap w-full">
        <div className="flex-1">
          <motion.div className="flex justify-center items-center dark:brightness-50">
            <motion.img
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              variants={imageAnimation}
              src={lamviecImg}
              alt=""
            />
          </motion.div>
        </div>

        <div className="flex-1 z-10">
          <form
            className="flex justify-center items-center h-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div
              className="w-[560px]"
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              variants={staggerChildrenAnimation}
            >
              {/* Title */}
              <motion.div
                variants={childrenAnimation}
                className="mb-4 font-bold text-center text-3xl text-primary-500"
              >
                {t("login")}
              </motion.div>

              <ErrorNotificationCard
                show={!isLoading && isError}
                errorMessage={errorMessage}
              />

              {/* Email input */}
              <motion.div variants={childrenAnimation}>
                <TEInput
                  type="text"
                  label="Email"
                  className="w-full bg-white dark:bg-neutral-900"
                  size="lg"
                  autoFocus
                  {...register("email")}
                />
              </motion.div>

              <InputValidationMessage
                show={dirtyFields.email || false}
                validateFn={() => EmailSchema.parse(watch("email"))}
              />

              {/* Password input */}
              <motion.div className="mt-3" variants={childrenAnimation}>
                <PasswordInput
                  label="Password"
                  className="w-full bg-white dark:bg-neutral-900"
                  size="lg"
                  {...register("password")}
                />
              </motion.div>

              <InputValidationMessage
                show={dirtyFields.password || false}
                validateFn={() => PasswordSchema.parse(watch("password"))}
              />

              <motion.div
                className="text-right font-bold text-primary-500 hover:text-primary-600 underline dark:text-primary-700 dark:hover:text-primary-600 duration-200"
                variants={childrenAnimation}
              >
                <Link to={`/auth/forgot-password`}>Forgot password?</Link>
              </motion.div>

              {/* Submit button */}
              <motion.div className="mt-5" variants={childrenAnimation}>
                <TERipple className="w-full">
                  <Button
                    type="submit"
                    containerClassName="w-full"
                    className="h-[45px]"
                    disabled={!isValid}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {!isLoading && t("login")}
                    {isLoading && (
                      <CgSpinner className="m-auto text-lg animate-spin" />
                    )}
                  </Button>
                </TERipple>
              </motion.div>
            </motion.div>
          </form>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
