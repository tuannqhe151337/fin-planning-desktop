import { Variants, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { TermCard } from "../ui/term-card";
import { useHotkeys } from "react-hotkeys-hook";
import { produce, nothing } from "immer";
import { TermCreatePlan } from "../../../providers/store/api/termApi";
import { Skeleton } from "../../../shared/skeleton";

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
    opacity: 0.2,
  },
  visible: {
    opacity: 1,
  },
};

interface Props {
  hide?: boolean;
  isFetching?: boolean;
  height?: number;
  isEmpty?: boolean;
  terms: TermCreatePlan[];
  onClick?: (term: TermCreatePlan) => any;
}

export const TermList: React.FC<Props> = ({
  hide,
  isFetching,
  height = 368,
  isEmpty,
  terms,
  onClick,
}) => {
  // State
  const [selectedTermIndex, setSelectedTermIndex] = useState<number>();

  // Enter
  useHotkeys("enter", () => {
    if (selectedTermIndex !== undefined && selectedTermIndex !== null) {
      onClick && onClick(terms[selectedTermIndex]);
    }
  });

  // Up and down hotkey
  useHotkeys(
    "up",
    () => {
      setSelectedTermIndex(
        produce((selectedTermIndex) => {
          if (selectedTermIndex === null || selectedTermIndex === undefined) {
            return terms.length - 1;
          } else if (selectedTermIndex === 0) {
            return nothing;
          } else {
            return selectedTermIndex - 1;
          }
        }),
      );
    },
    { enableOnFormTags: ["input", "INPUT"] },
  );

  useHotkeys(
    "down",
    () => {
      setSelectedTermIndex(
        produce((selectedTermIndex) => {
          if (selectedTermIndex === null || selectedTermIndex === undefined) {
            return 0;
          } else if (selectedTermIndex === terms.length - 1) {
            return nothing;
          } else {
            return selectedTermIndex + 1;
          }
        }),
      );
    },
    { enableOnFormTags: ["input", "INPUT"] },
  );

  // Deselect element when click outside
  const ref = useRef<HTMLDivElement>(null);

  const clickHandler = useCallback(
    (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setSelectedTermIndex(undefined);
      }
    },
    [ref.current],
  );

  useEffect(() => {
    document.addEventListener("click", clickHandler, true);

    return () => {
      document.removeEventListener("click", clickHandler, true);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col py-6 gap-3 w-full"
      style={{ height }}
      initial={AnimationStage.HIDDEN}
      animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      {isEmpty && (
        <div className="italic font-semibold text-neutral-400 dark:text-neutral-500">
          No available term
        </div>
      )}

      {isFetching &&
        new Array(5)
          .fill(true)
          .map((_, index) => (
            <Skeleton key={index} className="w-full h-[55px]" />
          ))}

      {!isFetching &&
        terms.map((term, index) => (
          <motion.div
            key={term.termId}
            className="w-full"
            variants={childrenAnimation}
          >
            <TermCard
              onClick={() => {
                onClick && onClick(term);
              }}
              selected={selectedTermIndex === index}
              termName={term.name}
              type={term.duration}
              startDate={term.startDate}
              endDate={term.endDate}
            />
          </motion.div>
        ))}
    </motion.div>
  );
};
