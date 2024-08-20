import { motion } from "framer-motion";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaUpload } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";
import clsx from "clsx";

interface Props {
  stage: number;
}

export const StepProgress: React.FC<Props> = ({ stage }) => {
  return (
    <div className="relative md:w-[800px] xl:w-[1000px] h-fit">
      <div className="absolute w-full h-full top-[23px] left-0 z-0">
        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full z-10"></div>
      </div>

      <div className="absolute w-full h-full top-[23px] left-0 z-0">
        <motion.div
          layout
          className={clsx({
            "h-1 bg-primary-500 dark:bg-primary-800 rounded-full z-20": true,
            "w-0": stage === 0,
            "w-1/6": stage === 1,
            "w-1/2": stage === 2,
            "w-5/6": stage === 3,
          })}
        ></motion.div>
      </div>

      <div className="relative z-30">
        <div className="flex flex-row flex-wrap items-center justify-around">
          {/* Step 1 */}
          <div className="flex flex-col flex-wrap items-center">
            <div
              className={clsx({
                "flex flex-row flex-wrap items-center justify-center size-[50px] rounded-full duration-500":
                  true,
                "bg-neutral-300 dark:bg-neutral-600": stage < 1,
                "bg-primary-500 dark:bg-primary-800": stage >= 1,
              })}
            >
              <RiCalendarScheduleFill
                className={clsx({
                  "text-xl text-white duration-500": true,
                  "dark:text-neutral-400": stage < 1,
                  "text-white": stage >= 1,
                })}
              />
            </div>
            <p
              className={clsx({
                "mt-1.5 text-sm font-bold duration-500": true,
                "text-neutral-300 dark:text-neutral-600": stage < 1,
                "text-primary-500": stage >= 1,
              })}
            >
              Select term
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col flex-wrap items-center">
            <div
              className={clsx({
                "flex flex-row flex-wrap items-center justify-center size-[50px] rounded-full duration-500":
                  true,
                "bg-neutral-300 dark:bg-neutral-600": stage < 2,
                "bg-primary-500 dark:bg-primary-700": stage >= 2,
              })}
            >
              <FaUpload
                className={clsx({
                  "text-lg mb-1 duration-500": true,
                  "text-white dark:text-neutral-400": stage < 2,
                  "text-white": stage >= 2,
                })}
              />
            </div>
            <p
              className={clsx({
                "mt-1.5 text-sm font-bold duration-500": true,
                "text-neutral-300 dark:text-neutral-500": stage < 2,
                "text-primary-500": stage >= 2,
              })}
            >
              Upload plan
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col flex-wrap items-center">
            <div
              className={clsx({
                "flex flex-row flex-wrap items-center justify-center size-[50px] rounded-full duration-500":
                  true,
                "bg-neutral-300 dark:bg-neutral-600": stage < 3,
                "bg-primary-500 dark:bg-primary-800": stage >= 3,
              })}
            >
              <FaListUl
                className={clsx({
                  "text-lg duration-500": true,
                  "text-white dark:text-neutral-400": stage < 3,
                  "text-white": stage >= 3,
                })}
              />
            </div>
            <p
              className={clsx({
                "mt-1.5 text-sm font-bold duration-500": true,
                "text-neutral-300 dark:text-neutral-500": stage < 3,
                "text-primary-500": stage >= 3,
              })}
            >
              Confirm expenses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
