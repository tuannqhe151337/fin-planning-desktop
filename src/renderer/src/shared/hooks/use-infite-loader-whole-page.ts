import { useEffect, useState } from "react";

export const useInfiteLoaderWholePage = (onLoadMore: () => any) => {
  // Infinite loader
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setIsLoadMore(true);
      } else {
        setIsLoadMore(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isLoadMore) {
      onLoadMore();
    }
  }, [isLoadMore]);
};
