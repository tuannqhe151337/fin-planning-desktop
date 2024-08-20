import { useCallback, useEffect, useRef, useState } from "react";
import { Variants, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../utils/cn";

const listButtonAnimation: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      staggerChildren: 0.05,
      stiffness: 10,
      damping: 10,
    },
  },
};

const buttonAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

type InnerShadow = "left" | "right";

interface Item {
  id: string | number;
  name: string;
}

interface Props {
  items: Item[];
  selectedItemId?: string | number;
  className?: string;
  onItemChangeHandler?: (item: Item, index: number) => void;
}

export const TabList: React.FC<Props> = ({
  onItemChangeHandler,
  selectedItemId,
  items,
  className,
}) => {
  const [layoutId] = useState<string>(uuidv4());
  const [innerShadows, setInnerShadows] = useState<InnerShadow[]>([]);

  const getInnerShadowStyle = useCallback(() => {
    if (innerShadows.length == 0) {
      return undefined;
    }

    let styles: string[] = [];
    for (let i = 0; i < innerShadows.length; i++) {
      switch (innerShadows[i]) {
        case "left":
          styles.push("inset 10px -3px 3px -7px rgba(0,0,0,0.1)");
          break;

        case "right":
          styles.push("inset -10px -3px 3px -7px rgba(0,0,0,0.1)");
          break;
      }
    }

    let style = "";
    for (let i = 0; i < styles.length; i++) {
      if (i === 0) {
        style += styles[i];
      } else {
        style += `, ${styles[i]}`;
      }
    }

    return style;
  }, [innerShadows]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Using timeout to wait after animation
      const id = setTimeout(() => {
        const maxScrollValue =
          ref.current!.scrollWidth - ref.current!.clientWidth;

        const newInnerShadows: InnerShadow[] = [];
        if (ref.current!.scrollLeft > 20) {
          newInnerShadows.push("left");
        }

        if (ref.current!.scrollLeft < maxScrollValue - 20) {
          newInnerShadows.push("right");
        }

        setInnerShadows(newInnerShadows);
      }, items.length * 50);

      return () => clearTimeout(id);
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "flex flex-row overflow-x-auto overflow-y-hidden scrollbar-hide text-base font-medium text-center text-slate-500 dark:text-neutral-400",
        className
      )}
      style={{
        boxShadow: getInnerShadowStyle(),
      }}
      onScroll={(e) => {
        const maxScrollValue =
          e.currentTarget.scrollWidth - e.currentTarget.clientWidth;

        const newInnerShadows: InnerShadow[] = [];
        if (e.currentTarget.scrollLeft > 20) {
          newInnerShadows.push("left");
        }

        if (e.currentTarget.scrollLeft < maxScrollValue - 20) {
          newInnerShadows.push("right");
        }

        setInnerShadows(newInnerShadows);
      }}
      initial={"hidden"}
      animate={"visible"}
      variants={listButtonAnimation}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="px-4 py-2 min-w-fit relative cursor-pointer border-b-2 border-b-neutral-200 dark:border-b-neutral-700"
          variants={buttonAnimation}
          onClick={() => {
            if (item.id === selectedItemId) {
              return;
            }

            onItemChangeHandler && onItemChangeHandler(item, index);
          }}
        >
          <p
            className={`duration-200 first-letter font-bold text-neutral-400 ${
              item.id === selectedItemId
                ? "text-primary-500 dark:text-primary-400"
                : "hover:text-neutral-500 hover:dark:text-neutral-300"
            } `}
          >
            {item.name}
          </p>
          {item.id === selectedItemId ? (
            <motion.div
              className="absolute z-20 -bottom-0.5 left-0 h-0.5 w-full bg-primary-500"
              layoutId={layoutId}
            ></motion.div>
          ) : null}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TabList;
