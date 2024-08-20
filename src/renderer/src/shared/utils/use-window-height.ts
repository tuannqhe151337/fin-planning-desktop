import { useEffect, useState } from "react";

export const useWindowHeight = () => {
  // Calculate optimal height for select term
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowHeight;
};
