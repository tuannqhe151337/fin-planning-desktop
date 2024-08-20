import React, { memo } from "react";
import { cn } from "../utils/cn";

interface Props {
  number?: number;
  className?: string;
  width?: number;
  height?: number;
}

// https://stackoverflow.com/questions/68175873/detect-element-reference-height-change
// https://asaqeni.com/projects/create-a-starry-sky
export const Stars: React.FC<Props> = memo<Props>(
  ({ number = 100, className, width = 100, height = 100 }) => {
    return (
      <>
        {new Array(number).fill(true).map((_, index) => (
          <div
            key={index}
            className={cn(
              "star absolute size-[2px] bg-neutral-400 rounded-full animate-twinkle-effect",
              className
            )}
            style={{
              left: Math.random() * width,
              top: Math.random() * height,
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
            }}
          />
        ))}
      </>
    );
  },
  (prevProps, newProps) =>
    prevProps.number === newProps.number &&
    prevProps.width === newProps.width &&
    prevProps.height === newProps.height
);
