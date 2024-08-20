import React from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../utils/cn";

type Size = "md" | "lg";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: Size;
  label?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const Switch: React.FC<Props> = ({
  size = "md",
  label,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <input
        id={uuidv4()}
        className={cn(
          {
            "mr-2 mt-[0.3rem] appearance-none rounded-full bg-neutral-300 dark:bg-neutral-600 dark:checked:bg-primary before:pointer-events-none before:absolute before:rounded-full before:bg-transparent before:content-[''] after:absolute after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:rounded-full checked:after:border-none checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:block focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]":
              true,
            "h-3.5 w-8 before:size-3.5 after:-mt-[0.1875rem] after:size-5 after:bg-neutral-100 checked:bg-primary checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:size-5 checked:after:bg-primary focus:after:size-5 checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:after:bg-neutral-400 dark:checked:after:bg-primary":
              size === "md",
            "h-7 w-12 before:size-3.5 before:mt-[7.5px] before:ml-[4px] checked:focus:before:ml-[23px] after:size-6 after:mt-[1.88px] after:ml-0.5 checked:after:mt-[1.88px] checked:after:size-6 focus:after:size-6 checked:after:ml-[22px] checked:after:bg-neutral-50":
              size === "lg",
          },
          className
        )}
        type="checkbox"
        role="switch"
        {...props}
      />
      <label
        htmlFor={uuidv4()}
        className="inline-block pl-[0.15rem] hover:cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};
