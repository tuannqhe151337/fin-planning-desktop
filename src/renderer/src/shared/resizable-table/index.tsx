// Check the tutorial here: https://www.letsbuildui.dev/articles/resizable-tables-with-react-and-css-grid/
import { Reorder } from "framer-motion";
import {
  RefObject,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { HeaderItem } from "./HeaderItem";
import { cn } from "../utils/cn";

export interface Header {
  id: string;
  header: React.ReactNode;
  initialWidth?: string | number;
  minWidth?: number;
}

interface Props<T extends Header> {
  className?: string;
  headers: T[];
  onReorder: (newOrder: T[]) => any;
  body?: React.ReactNode;
}

const generateInitialColumnGrid = (headers: Header[]): string => {
  return headers
    .map((header) => {
      const minWidth = header.minWidth ? `${header.minWidth}px` : `150px`;
      let initialWidth: string = "";

      switch (typeof header.initialWidth) {
        case "string":
          initialWidth = header.initialWidth;
          break;

        case "number":
          initialWidth = `${header.initialWidth}px`;
          break;

        default:
          initialWidth = "1fr";
          break;
      }

      return `minmax(${minWidth}, ${initialWidth})`;
    })
    .join(" ");
};

export const ResizableTable = <T extends Header>(
  props: Props<T>
): React.ReactNode => {
  const tableRef = useRef<HTMLTableElement>(null);

  const headerRefs = useRef<Record<string, RefObject<HTMLTableCellElement>>>(
    {}
  );
  const headerWidthMap = useRef<Record<string, number>>({});

  const [activeIndex, setActiveIndex] = useState<number>();
  const [tableHeight, setTableHeight] = useState<number>(0);

  // Table height for resize handler
  useEffect(() => {
    setTableHeight(tableRef.current?.offsetHeight || 0);
  }, [props.body]);

  // Resize
  useEffect(() => {
    if (activeIndex !== null && activeIndex !== undefined) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);

      // Set CSS can't select when dragging
      tableRef.current?.classList.add("select-none");
    }

    return removeListener;
  }, [activeIndex]);

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      if (tableRef.current) {
        // Calculate width of header
        const columnWidths: Record<string, number> = {};

        props.headers.map(({ id, minWidth }, index) => {
          const ref = headerRefs.current[id];

          if (index === activeIndex) {
            let width =
              e.clientX - (ref.current?.getBoundingClientRect().left || 0);

            if (minWidth && width < minWidth) {
              width = minWidth;
            }

            columnWidths[id] = width;
          } else {
            columnWidths[id] = ref.current?.getBoundingClientRect().width || 0;
          }
        });

        // Store header width in ref
        headerWidthMap.current = columnWidths;

        // Set to CSS to make it resizable
        tableRef.current.style.gridTemplateColumns = `${props.headers
          .map(({ id }) => `${columnWidths[id]}px`)
          .join(" ")}`;
      }
    },
    [tableRef.current, props.headers, activeIndex]
  );

  const removeListener = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(undefined);
    removeListener();
    tableRef.current?.classList.remove("select-none");
  }, [setActiveIndex, removeListener]);

  // Reorder: keeping column width when reorder column
  useEffect(() => {
    if (tableRef.current) {
      const gridTemplateColumns = `${props.headers
        .map(({ id, initialWidth, minWidth }) => {
          if (!headerWidthMap.current[id]) {
            switch (typeof initialWidth) {
              case "string":
                return initialWidth;

              case "number":
                return `${initialWidth}px`;

              default:
                return `minmax(${minWidth}px, 1fr)`;
            }
          } else {
            return `${headerWidthMap.current[id]}px`;
          }
        })
        .join(" ")}`;

      tableRef.current.style.gridTemplateColumns = gridTemplateColumns;
    }
  }, [props.headers]);

  return (
    <table
      ref={tableRef}
      className={cn(
        "w-full grid [&>thead]:contents [&>tbody]:contents content-baseline dark:[color-scheme:dark] overflow-x-auto overflow-y-hidden",
        props.className
      )}
      style={{ gridTemplateColumns: generateInitialColumnGrid(props.headers) }}
    >
      <thead className="[&>tr]:contents">
        <Reorder.Group
          axis="x"
          as="tr"
          values={props.headers}
          onReorder={(newOrder) => props.onReorder(newOrder)}
        >
          {props.headers.map((header, index) => {
            return (
              <HeaderItem
                key={header.id}
                ref={(el) => {
                  // Assign element to ref
                  if (el) {
                    if (!headerRefs.current[header.id]) {
                      headerRefs.current[header.id] =
                        createRef<HTMLTableCellElement>();
                    }

                    // @ts-ignore
                    headerRefs.current[header.id].current = el; // Don't know why current is readonly
                  }
                }}
                className="border-b-2 border-b-neutral-200 dark:border-b-neutral-700 text-neutral-500 dark:text-neutral-400"
                handleClassName={
                  index === props.headers.length - 1 ? `right-0` : undefined
                }
                value={header}
                tableHeight={tableHeight}
                onMouseDown={() => {
                  setActiveIndex(index);
                }}
                onReordering={(isReordering) => {
                  if (isReordering) {
                    tableRef.current?.classList.add("select-none");
                  } else {
                    tableRef.current?.classList.remove("select-none");
                  }
                }}
              >
                {header.header}
              </HeaderItem>
            );
          })}
        </Reorder.Group>
      </thead>

      <tbody className="[&>tr]:contents">{props.body}</tbody>
    </table>
  );
};
