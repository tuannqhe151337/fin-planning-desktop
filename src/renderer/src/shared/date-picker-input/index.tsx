import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import { PatternFormat } from "react-number-format";
import { FaCalendar } from "react-icons/fa6";
import { format, parse } from "date-fns";
import { DayPicker } from "react-day-picker";
import { TERipple } from "tw-elements-react";
import { AdornmentInput } from "../adornment-input";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useDetectDarkmode } from "../hooks/use-detect-darkmode";
import { mergeRefs } from "react-merge-refs";
import { cn } from "../utils/cn";
import { formatDate } from "../utils/format-date";
import clsx from "clsx";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

const duration = 200; // In miliseconds

interface ModalPosition {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

export interface DatePickerInputProps {
  className?: string;
  calendarClassName?: string;
  datePattern?: string;
  modalPosition?: ModalPosition;
  value?: Date;
  allowEmpty?: boolean;
  disabled?: boolean;
  onChange?: (value: Date) => any;
  onClickOutside?: () => any;
  onFocus?: () => any;
  onBlur?: () => any;
}

export const DatePickerInput = forwardRef<HTMLDivElement, DatePickerInputProps>(
  (
    {
      className,
      calendarClassName,
      datePattern = "dd/MM/yyyy",
      modalPosition,
      value,
      allowEmpty,
      disabled,
      onChange,
      onClickOutside,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const isDarkMode = useDetectDarkmode();

    const [inputValue, setInputValue] = useState<string>(
      value ? formatDate(value, datePattern) : ""
    );
    const [monthSelected, setMonthSelected] = useState<Date>();
    const [isInputValueValid, setIsInputValueValid] = useState<boolean>();
    const [showCalender, setShowCalendar] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLElement>(null);

    // Check if inputValue is a valid date
    useEffect(() => {
      if (inputValue === "" && allowEmpty) {
        setIsInputValueValid(true);
      } else {
        const date = inputValue && parse(inputValue, datePattern, new Date());

        if (date instanceof Date && !isNaN(date.valueOf())) {
          setIsInputValueValid(true);
        } else {
          setIsInputValueValid(false);
        }
      }
    }, [inputValue]);

    // onChange
    useEffect(() => {
      if (isInputValueValid) {
        const date = inputValue && parse(inputValue, datePattern, new Date());
        onChange && date instanceof Date && onChange(date);
      }
    }, [isInputValueValid, inputValue]);

    // Select month base on valid input value
    useEffect(() => {
      if (isInputValueValid) {
        const date = inputValue && parse(inputValue, datePattern, new Date());
        date instanceof Date && setMonthSelected(date);
      }
    }, [isInputValueValid, inputValue]);

    // Close calendar when click outside
    useHotkeys(
      "esc",
      () => {
        setShowCalendar(false);
      },
      { enableOnFormTags: ["INPUT", "input"] }
    );

    const clickHandler = useCallback(
      (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
          setShowCalendar(false);
          onClickOutside && onClickOutside();
          onBlur && onBlur();
        }
      },
      [onClickOutside, onBlur]
    );

    useEffect(() => {
      if (showCalender) {
        document.addEventListener("click", clickHandler, true);
      }

      return () => {
        document.removeEventListener("click", clickHandler, true);
      };
    }, [showCalender]);

    // Delay 200ms to wait for modal to unmount after running animation
    useEffect(() => {
      if (showCalender) {
        setShowModal(true);
      } else {
        const timeoutId = setTimeout(() => {
          setShowModal(false);
        }, duration);

        return () => {
          clearTimeout(timeoutId);
        };
      }
    }, [showCalender]);

    return (
      <div
        ref={mergeRefs([ref, containerRef])}
        className={cn(`relative w-full h-full`, className)}
      >
        <PatternFormat
          getInputRef={inputRef}
          className={cn(
            "text-base font-semibold !text-neutral-500 disabled:!text-neutral-400/70 disabled:dark:!text-neutral-500 focus:-outline-offset-1 focus:outline-primary focus:outline-[2px] focus:shadow-sm focus:shadow-primary dark:!text-neutral-400 duration-500",
            {
              "outline-offset-1 outline-[2px] outline-red-600":
                isInputValueValid === false,
            }
          )}
          value={inputValue}
          pattern="##/##/####"
          format="##/##/####"
          mask="_"
          endAdornment={
            <div
              className="flex flex-row flex-wrap items-center w-full h-full mt-[2.25px] mr-1 rounded-full overflow-hidden"
              onClick={() => {
                !disabled && setShowCalendar((prevState) => !prevState);
              }}
            >
              <TERipple
                className="cursor-pointer rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-700 duration-500 p-2"
                rippleColor={isDarkMode ? "light" : "dark"}
              >
                <FaCalendar
                  className={clsx({
                    "duration-200": true,
                    "text-neutral-300 dark:text-neutral-500": disabled,
                    "text-neutral-500/80 dark:text-neutral-400/80": !disabled,
                  })}
                />
              </TERipple>
            </div>
          }
          customInput={AdornmentInput}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
          }}
          onFocus={() => {
            setShowCalendar(true);
            onFocus && onFocus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              setShowCalendar(false);
            }
          }}
          onBlur={() => {
            if (!showCalender) {
              onBlur && onBlur();
            }
          }}
        />

        <AnimatePresence>
          {!disabled && showModal && isInputValueValid && (
            <motion.div
              className={cn(
                "absolute bg-white dark:bg-neutral-700 shadow rounded-lg z-30",
                calendarClassName
              )}
              style={{
                top: modalPosition?.top || 50,
                left: modalPosition?.left,
                right: modalPosition?.right,
                bottom: modalPosition?.bottom,
              }}
              initial={AnimationStage.HIDDEN}
              animate={
                showCalender ? AnimationStage.VISIBLE : AnimationStage.HIDDEN
              }
              exit={AnimationStage.HIDDEN}
              variants={animation}
              transition={{ duration: duration / 1000 }}
            >
              <DayPicker
                mode="single"
                classNames={{
                  day: "w-[40px] h-[40px] rounded-full duration-500",
                  button: "dark:hover:bg-neutral-600 cursor-pointer",
                  button_reset: "cursor-pointer",
                }}
                modifiersClassNames={{
                  selected:
                    "!bg-primary-200 dark:!bg-primary-800 !text-primary-800 dark:!text-primary-200 !font-bold",
                }}
                month={monthSelected}
                onMonthChange={(date) => {
                  setMonthSelected(date);
                }}
                selected={
                  inputValue
                    ? parse(inputValue, datePattern, new Date())
                    : undefined
                }
                onSelect={(date) => {
                  date && setInputValue(format(date, datePattern));
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
