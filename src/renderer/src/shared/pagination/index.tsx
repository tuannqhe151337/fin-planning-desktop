import clsx from "clsx";
import { Button } from "../../shared/button";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { cn } from "../utils/cn";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  className?: string;
  page: number | undefined | null;
  totalPage: number;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const Pagination: React.FC<Props> = ({
  className,
  page,
  totalPage,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // i18n
  const { t } = useTranslation(["pagination"]);

  // Hotkeys
  useHotkeys(["shift + n", "shift + ."], () => {
    onNext && onNext();
  });

  useHotkeys(["shift + p", "shift + ,"], () => {
    onPrevious && onPrevious();
  });

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap justify-between w-full",
        className
      )}
    >
      <Button
        disabled={page === 1}
        variant="quaternary"
        className="flex flex-row flex-wrap items-center text-sm font-bold "
        onClick={() => {
          onPrevious && onPrevious();
        }}
      >
        <FaAngleLeft className="opacity-70" />
        <span className="ml-2 mr-1">{t("Previous page")}</span>
      </Button>

      <div className="flex flex-row flex-wrap items-center -ml-5 text-sm font-semibold text-neutral-400">
        <span className="mr-1.5">{t("Page")}</span>
        <input
          value={page || ""}
          className={clsx({
            "mr-1 bg-transparent": true,
            "w-4":
              !page ||
              page === null ||
              page === undefined ||
              (page && page < 10),
            "w-6": page && page >= 10,
            "w-8": page && page >= 100,
            "w-10": page && page >= 1000,
            "w-12": page && page >= 10000,
            "w-14": page && page >= 100000,
            "w-16": page && page >= 1000000,
          })}
          onChange={(e) => {
            const value = e.currentTarget.value;
            if (value === "") {
              onPageChange && onPageChange(null);
            }

            const page = parseInt(value);
            if (!isNaN(page)) {
              onPageChange && onPageChange(page);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              e.currentTarget.blur();
            }
          }}
          onBlur={(e) => {
            const page = parseInt(e.currentTarget.value);
            if (!isNaN(page)) {
              if (page < 1) {
                onPageChange && onPageChange(1);
              } else if (page > totalPage) {
                onPageChange && onPageChange(totalPage);
              } else {
                onPageChange && onPageChange(page);
              }
            } else if (isNaN(page)) {
              onPageChange && onPageChange(1);
            }
          }}
        />
        <span className="text-neutral-300 dark:text-neutral-500">/</span>
        <span className="ml-2.5">{totalPage}</span>
      </div>

      <Button
        disabled={page === totalPage}
        variant="quaternary"
        className="flex flex-row flex-wrap items-center"
        onClick={() => {
          onNext && onNext();
        }}
      >
        <span className="mr-3 ml-2 text-sm font-bold">{t("Next page")}</span>
        <FaAngleRight className="opacity-50" />
      </Button>
    </div>
  );
};
