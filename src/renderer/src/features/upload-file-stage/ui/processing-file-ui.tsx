import { NumericFormat } from "react-number-format";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FaFileCircleExclamation } from "react-icons/fa6";
import { IconButton } from "../../../shared/icon-button";
import { IoClose } from "react-icons/io5";
import { FileUploadStage } from "../type";
import { useEffect, useState } from "react";
import clsx from "clsx";

enum Stage {
  PROCESSING = "processing",
  CHECK = "check",
  SUCCESS = "success",
  INVALID_FORMAT_ERROR = "invalid_format_error",
  VALIDATION_ERROR = "validation_err",
}

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const fadingAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
    transition: {
      duration: 0.5,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

interface Props {
  fileUploadStage: FileUploadStage;
  onCancel?: () => any;
  fileName?: string;
  fileSize?: number;
}

export const ProcessingFileUI: React.FC<Props> = ({
  fileUploadStage,
  onCancel,
  fileName,
  fileSize,
}) => {
  const [stage, setStage] = useState<Stage>(Stage.PROCESSING);

  useEffect(() => {
    if (fileUploadStage === FileUploadStage.SUCCESS) {
      setStage(Stage.CHECK);

      const timeoutId = setTimeout(() => {
        setStage(Stage.SUCCESS);
      }, 750);

      return () => {
        clearTimeout(timeoutId);
      };
    } else if (fileUploadStage === FileUploadStage.INVALID_FORMAT_ERROR) {
      setStage(Stage.INVALID_FORMAT_ERROR);
    }
  }, [fileUploadStage]);

  return (
    <div className="flex flex-row flex-wrap items-center justify-center w-full h-full">
      <div className="relative bg-white dark:bg-neutral-700/50 rounded-lg shadow min-w-[200px] min-h-[225px] px-5 py-3">
        <div className="absolute -top-4 -right-4">
          <IconButton
            className="p-1.5 bg-neutral-200/50 dark:bg-neutral-700/70 hover:bg-neutral-200"
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            <IoClose className="text-2xl text-neutral-500/70 dark:text-neutral-400" />
          </IconButton>
        </div>

        <div className="flex flex-col flex-wrap items-center justify-center w-full h-full font-semibold dark:font-bold text-center">
          {/* File icon */}
          <div className="relative w-full h-[110px]">
            <AnimatePresence>
              {stage === Stage.PROCESSING && (
                <motion.div
                  className="absolute w-full h-full"
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                  variants={fadingAnimation}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex flex-row flex-wrap justify-center items-center w-full h-full">
                    <RiFileExcel2Fill className="text-[110px] text-neutral-200 dark:text-neutral-500 animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === Stage.CHECK && (
                <motion.div
                  className="absolute w-full h-full"
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                  variants={fadingAnimation}
                >
                  <div className="flex flex-row flex-wrap justify-center items-center w-full h-full">
                    <div className="bg-green-400 dark:bg-green-700 p-3 rounded-full w-min h-min">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-16"
                      >
                        <motion.path
                          className="stroke-white dark:stroke-neutral-300"
                          strokeWidth={3.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === Stage.SUCCESS && (
                <motion.div
                  className="absolute w-full h-full"
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                  variants={fadingAnimation}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex flex-row flex-wrap justify-center items-center w-full h-full">
                    <RiFileExcel2Fill className="text-[110px] text-green-600 dark:text-green-700" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === Stage.INVALID_FORMAT_ERROR && (
                <motion.div
                  className="absolute w-full h-full"
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                  variants={fadingAnimation}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex flex-row flex-wrap justify-center items-center w-full h-full">
                    <FaFileCircleExclamation className="-mr-5 text-[100px] text-red-600 dark:text-red-700" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* File name and file size */}
          <p
            className={clsx({
              "mt-2": true,
              "text-neutral-200 dark:text-neutral-500 animate-pulse duration-300":
                stage === Stage.PROCESSING,
              "text-neutral-400": stage !== Stage.PROCESSING,
            })}
          >
            {fileName}
          </p>
          {fileSize && (
            <p
              className={clsx({
                "text-xs": true,
                "text-neutral-200 dark:text-neutral-500 animate-pulse duration-300":
                  stage === Stage.PROCESSING,
                "text-neutral-400/50": stage !== Stage.PROCESSING,
              })}
            >
              <NumericFormat
                decimalScale={2}
                displayType="text"
                value={fileSize / 1000}
              />{" "}
              KB
            </p>
          )}

          {/* File's status */}
          <div>
            {stage === Stage.PROCESSING && (
              <p className="mt-7 text-neutral-200 dark:text-neutral-500 animate-pulse">
                <span>Processing</span>
                <motion.span
                  className="font-bold"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                >
                  .
                </motion.span>
                <motion.span
                  className="font-bold"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                >
                  .
                </motion.span>
                <motion.span
                  className="font-bold"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 2 }}
                >
                  .
                </motion.span>
              </p>
            )}

            {(stage === Stage.CHECK || stage === Stage.SUCCESS) && (
              <p className="mt-7 font-bold text-green-600">
                Process successfully!
              </p>
            )}

            {stage === Stage.INVALID_FORMAT_ERROR && (
              <div className="mt-2">
                <p className="font-extrabold text-red-600">
                  Invalid file format!
                </p>
                <p className="mt-1 font-bold text-red-700 text-sm">
                  Please download the file template <br /> and{" "}
                  <span
                    className="underline text-red-600 hover:text-red-500 cursor-pointer duration-200"
                    onClick={() => {
                      onCancel && onCancel();
                    }}
                  >
                    try again!
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
