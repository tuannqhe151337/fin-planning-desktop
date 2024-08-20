import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { FaSearch } from "react-icons/fa";
import { cn } from "../utils/cn";
import { useTranslation } from "react-i18next";

interface Props extends React.ButtonHTMLAttributes<HTMLInputElement> {
  hideCtrlK?: boolean;
  containerClassName?: string;
  className?: string;
}

export const SearchBox: React.FC<Props> = ({
  hideCtrlK = false,
  containerClassName,
  className,
  ...props
}) => {
  // i18n
  const { t } = useTranslation(["filter-search"]);

  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocus, setIsFocus] = useState<boolean>();

  useHotkeys("ctrl + k", (e) => {
    if (inputRef.current) {
      e.preventDefault();
      inputRef.current.focus();
    }
  });

  useHotkeys(
    ["up", "down", "esc"],
    (e) => {
      if (inputRef.current) {
        e.preventDefault();
        inputRef.current.blur();
      }
    },
    { enableOnFormTags: ["INPUT", "input"] }
  );

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center w-full border-2 rounded-lg border-neutral-200 focus-within:border-primary-300 outline outline-[6px] outline-transparent focus-within:outline-primary-50 dark:border-neutral-700 dark:focus-within:border-primary-800 dark:focus-within:outline-primary-950/50 cursor-text duration-200",
        {
          "hover:border-neutral-300 dark:hover:border-neutral-600": !isFocus,
        },
        containerClassName
      )}
      onClick={() => {
        inputRef.current && inputRef.current.focus();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={t("Search")}
        className={cn(
          "flex-1 py-3 bg-transparent outline-none h-full text-sm font-semibold",
          { "pl-5 pr-5": !hideCtrlK, "pl-5": hideCtrlK },
          className
        )}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setIsFocus(false);
        }}
        {...props}
      />
      {!hideCtrlK && (
        <div className="flex flex-wrap flex-row items-center justify-center py-1 px-2 bg-primary-400 dark:bg-primary-800 dark:text-neutral-300 rounded-lg text-xs font-bold text-white select-none cursor-pointer">
          Ctrl+K
        </div>
      )}
      <div className="ml-4 mr-5">
        <FaSearch className="text-primary-300 dark:text-primary-600 text-base cursor-pointer" />
      </div>
    </div>
  );
};
