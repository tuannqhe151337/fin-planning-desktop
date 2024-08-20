import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useDetectDarkmode } from "../../shared/hooks/use-detect-darkmode";

interface Props {
  children?: React.ReactNode;
}

export const ToastifyProvider: React.FC<Props> = ({ children }) => {
  const darkMode = useDetectDarkmode();

  return (
    <>
      {children} <ToastContainer theme={darkMode ? "dark" : "light"} />
    </>
  );
};
