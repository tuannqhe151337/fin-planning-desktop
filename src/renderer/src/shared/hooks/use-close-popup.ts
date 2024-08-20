import { useCallback, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  open: boolean;
  onClose: () => any;
  onClickInside?: () => any;
}

export const useCloseOutside = ({ open, onClose, onClickInside }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Shortcut
  useHotkeys(
    "esc",
    () => {
      onClose();
    },
    { enableOnFormTags: ["INPUT", "input"] }
  );

  const clickHandler = useCallback(
    (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onClose();
      } else {
        onClickInside && onClickInside();
      }
    },
    [onClose, onClickInside]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("click", clickHandler, true);

      return () => {
        document.removeEventListener("click", clickHandler, true);
      };
    }
  }, [open]);

  return ref;
};
