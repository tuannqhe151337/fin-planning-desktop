import { useEffect, useState } from "react";
import { uppercaseFirstCharacter } from "./uppercase-first-character";
import { ErrorData } from "../../providers/store/api/type";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { useDetectDarkmode } from "../hooks/use-detect-darkmode";

interface Param {
  error?: FetchBaseQueryError | SerializedError;
  isError: boolean;
}

export const useProcessError = ({ error, isError }: Param) => {
  // Error message
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isError) {
      if (error && "data" in error) {
        if (error.data && "message" in (error.data as any)) {
          setErrorMessage(
            uppercaseFirstCharacter((error.data as ErrorData).message)
          );
        }
      } else {
        setErrorMessage("Something went wrong, please try again!");
      }
    }
  }, [isError]);

  const isDarkmode = useDetectDarkmode();

  useEffect(() => {
    if (isError) {
      toast(errorMessage, {
        type: "error",
        theme: isDarkmode ? "dark" : "light",
      });
    }
  }, [isError, errorMessage]);

  return errorMessage;
};
