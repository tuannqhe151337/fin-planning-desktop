import { FaChevronDown } from "react-icons/fa6";
import { TERipple, TETooltip } from "tw-elements-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useCloseOutside } from "../../shared/hooks/use-close-popup";
import {
  Currency,
  useGetAllCurrencyQuery,
} from "../../providers/store/api/currencyApi";
import clsx from "clsx";
import { SearchBox } from "../../shared/search-box";
import { cn } from "../../shared/utils/cn";
import { useHotkeys } from "react-hotkeys-hook";
import { RiCoinsFill } from "react-icons/ri";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const dropDownAnimation: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

interface Props {
  className?: string;
  chosenCurrencyId?: number;
  onCurrencyChoose?: (currency?: Currency) => any;
}

export const CurrencyChanger: React.FC<Props> = ({
  className,
  chosenCurrencyId: currencyId,
  onCurrencyChoose,
}) => {
  // UI: open dropdown
  const [isOpened, setIsOpened] = useState(false);

  // Get all currencies
  const { data } = useGetAllCurrencyQuery();

  // Search currencies
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    setCurrencies(() => {
      return (
        data?.data.filter(
          (currency) =>
            currency.name.toLowerCase().includes(keyword.toLowerCase()) ||
            currency.symbol.toLowerCase().includes(keyword.toLowerCase())
        ) || []
      );
    });
  }, [keyword, data]);

  // Focus index
  const [focusIndex, setFocusIndex] = useState<number | null | undefined>();

  useHotkeys(
    "down",
    () => {
      setFocusIndex((prevState) => {
        if (prevState === null || prevState === undefined) {
          return 0;
        }

        if (prevState === currencies.length) {
          return null;
        }

        return prevState + 1;
      });
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "up",
    () => {
      setFocusIndex((prevState) => {
        if (prevState === null || prevState === undefined) {
          return currencies.length;
        }

        if (prevState === 0) {
          return null;
        }

        return prevState - 1;
      });
    },
    { enableOnFormTags: true }
  );

  useEffect(() => {
    setFocusIndex(null);
  }, [keyword, data]);

  useEffect(() => {
    setFocusIndex(null);
  }, [isOpened]);

  useHotkeys("enter", () => {
    onCurrencyChoose && onCurrencyChoose(currentFocusCurrency);
    setIsOpened(false);
  });

  // Click outside handler
  const ref = useCloseOutside({
    open: isOpened,
    onClose: () => {
      setIsOpened(false);
    },
  });

  // Current focus currency
  const currentFocusCurrency: Currency | undefined = useMemo(() => {
    if (!keyword) {
      if (focusIndex === 0) {
        return undefined;
      }

      if (focusIndex && focusIndex <= currencies.length) {
        return currencies[focusIndex - 1];
      }
    } else if (keyword && focusIndex !== null && focusIndex !== undefined) {
      if (focusIndex < currencies.length) {
        return currencies[focusIndex];
      }
    }
  }, [keyword, currencies, focusIndex]);

  // Current chosen currency
  const currentChosenCurrency: Currency | undefined = useMemo(() => {
    return data?.data.find((currency) => currency.currencyId === currencyId);
  }, [data?.data, currencyId]);

  return (
    <div ref={ref} className={cn("relative z-20 rounded-lg", className)}>
      <TETooltip
        tag="div"
        title={
          currentFocusCurrency ? currentFocusCurrency.name : "Convert currency"
        }
      >
        <TERipple
          className="flex flex-row flex-wrap items-center overflow-hidden rounded-xl px-3 py-2 group gap-1 mb-1 cursor-pointer"
          onClick={() => {
            setIsOpened(true);
          }}
        >
          <span className="text-sm mt-0.5 font-extrabold text-primary-500/70 group-hover:text-primary-500/80 dark:text-primary-500/80 select-none duration-200">
            {!currentChosenCurrency ? (
              <RiCoinsFill className="text-3xl" />
            ) : (
              currentChosenCurrency.name
            )}
          </span>{" "}
          <FaChevronDown className="text-xs text-primary-500/60 group-hover:text-primary-500/80 duration-200" />
        </TERipple>
      </TETooltip>

      <AnimatePresence>
        {isOpened && (
          <motion.div
            className="absolute right-0 mt-2"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={dropDownAnimation}
          >
            <div className="shadow w-[200px] rounded-lg bg-white overflow-hidden dark:bg-neutral-800">
              <div className="border-b-2 border-neutral-100 dark:border-b-neutral-700">
                <SearchBox
                  autoFocus
                  hideCtrlK
                  containerClassName="border-none outline-none outline-[0px] focus:outline-none"
                  className="w-[15px]"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.currentTarget.value);
                  }}
                />
              </div>
              <div>
                {!keyword && (
                  <TERipple
                    rippleColor="light"
                    className="w-full"
                    onClick={() => {
                      onCurrencyChoose && onCurrencyChoose(undefined);
                      setIsOpened(false);
                    }}
                  >
                    <div
                      className={clsx({
                        "group select-none text-sm w-full py-3 px-6 cursor-pointer font-bold hover:bg-primary-400 duration-200 dark:hover:bg-primary-900":
                          true,
                        "border-b-2 border-b-neutral-100 dark:border-b-neutral-700/50":
                          currencies.length !== 0,
                        "bg-primary-400 dark:bg-primary-900": focusIndex === 0,
                      })}
                    >
                      <span
                        className={clsx({
                          "group-hover:text-white mr-1": true,
                          "text-neutral-500/80 dark:text-neutral-400/80":
                            focusIndex !== 0,
                          "text-white": focusIndex === 0,
                        })}
                      >
                        Original
                      </span>
                    </div>
                  </TERipple>
                )}

                {currencies.map((currency, index) => (
                  <TERipple
                    key={currency.currencyId}
                    rippleColor="light"
                    className="w-full"
                    onClick={() => {
                      onCurrencyChoose && onCurrencyChoose(currency);
                      setIsOpened(false);
                    }}
                  >
                    <div
                      className={clsx({
                        "group select-none text-sm w-full py-3 px-6 cursor-pointer font-bold hover:bg-primary-400 duration-200 dark:hover:bg-primary-900":
                          true,
                        "border-b-2 border-b-neutral-100 dark:border-b-neutral-700/50":
                          index !== currencies.length - 1,
                        "bg-primary-400 dark:bg-primary-900":
                          currency.currencyId ===
                          currentFocusCurrency?.currencyId,
                      })}
                    >
                      <span
                        className={clsx({
                          "group-hover:text-white mr-1": true,
                          "text-neutral-500/80 dark:text-neutral-400/80":
                            currency.currencyId !==
                            currentFocusCurrency?.currencyId,
                          "text-white":
                            currency.currencyId ===
                            currentFocusCurrency?.currencyId,
                        })}
                      >
                        {currency.name}
                      </span>
                      <span
                        className={clsx({
                          "group-hover:text-white": true,
                          "text-neutral-500 dark:text-neutral-400":
                            currency.currencyId !==
                            currentFocusCurrency?.currencyId,
                          "text-white":
                            currency.currencyId ===
                            currentFocusCurrency?.currencyId,
                        })}
                      >
                        ({currency.symbol})
                      </span>
                    </div>
                  </TERipple>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
