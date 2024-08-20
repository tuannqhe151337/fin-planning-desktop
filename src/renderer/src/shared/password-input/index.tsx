import { forwardRef, useState } from "react";
import { TEInput } from "tw-elements-react";
import { InputProps } from "tw-elements-react/dist/types/forms/Input/types";
import { cn } from "../utils/cn";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props extends InputProps {
  containerClassName?: string;
  className?: string;
}

export const PasswordInput = forwardRef<any, Props>(
  ({ containerClassName, className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
      <div className={cn("relative", containerClassName)}>
        <TEInput
          ref={ref}
          type={isPasswordVisible ? "text" : "password"}
          className={className}
          {...props}
        />
        <div className="absolute top-0 right-0 h-full">
          <div
            className="flex flex-row flex-wrap items-center justify-center h-full rounded-full cursor-pointer px-4 group duration-200"
            onClick={() => {
              setIsPasswordVisible((prevState) => !prevState);
            }}
          >
            <div className="text-lg text-primary-500 group-hover:text-primary-400 group-active:text-primary-600 dark:text-primary-600 dark:group-hover:text-primary-500 dark:group-active:text-primary-500 duration-200">
              {isPasswordVisible && <FaEyeSlash />}
              {!isPasswordVisible && <FaEye />}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
