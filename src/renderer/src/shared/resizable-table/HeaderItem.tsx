import { Reorder, useDragControls } from "framer-motion";
import { forwardRef } from "react";
import { Header } from ".";

interface Props {
  children?: React.ReactNode;
  className?: string;
  value: Header;
  tableHeight?: number;
  onMouseDown?: React.MouseEventHandler<HTMLSpanElement>;
  onReordering?: (isDragging: boolean) => any;
  handleClassName?: string;
}

export const HeaderItem = forwardRef<HTMLTableCellElement, Props>(
  (
    {
      children,
      className,
      value,
      onMouseDown,
      tableHeight,
      onReordering,
      handleClassName,
    },
    ref
  ) => {
    // Detect is dragging
    const onMouseUp = () => {
      onReordering && onReordering(false);
      window.removeEventListener("mouseup", onMouseUp);
    };

    // Drag handler
    const controls = useDragControls();

    return (
      <Reorder.Item
        as="th"
        ref={ref}
        dragListener={false}
        dragControls={controls}
        className={`relative ${className}`}
        value={value}
      >
        <div
          className="cursor-grab h-full w-full"
          onPointerDown={(e) => {
            controls.start(e);
            onReordering && onReordering(true);
            window.addEventListener("mouseup", onMouseUp);
          }}
        >
          {children}
        </div>
        <span
          className={`block absolute cursor-ew-resize w-2 -right-0.5 top-0 z-10 border-r-4 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 active:border-primary-400 dark:active:border-primary-800 duration-200 ${handleClassName}`}
          style={{ height: `${tableHeight}px` }}
          onMouseDown={(e) => {
            onMouseDown && onMouseDown(e);
          }}
        />
      </Reorder.Item>
    );
  }
);
