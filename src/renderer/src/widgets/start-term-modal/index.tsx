import { IconButton } from "../../shared/icon-button";
import { Modal } from "../../shared/modal";
import { IoClose } from "react-icons/io5";
import { Button } from "../../shared/button";
import { FaExclamation } from "react-icons/fa";
import { useStartTermMutation } from "../../providers/store/api/termApi";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  termId: string | number;
  termName: string;
  show: boolean;
  onClose: () => any;
  onStartTermSuccessfully?: (termId: string | number) => any;
}

export const StartTermModal: React.FC<Props> = ({
  termId,
  termName,
  show,
  onClose,
  onStartTermSuccessfully,
}) => {
  // i18n
  const { t } = useTranslation(["term-management"]);

  const [startTerm, { isError, isLoading, isSuccess }] = useStartTermMutation();

  useEffect(() => {
    if (!isLoading && isSuccess && !isError) {
      toast("Activate term successfully!", { type: "success" });
      onStartTermSuccessfully && onStartTermSuccessfully(termId);
      onClose && onClose();
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <Modal
      className="w-[70vw] xl:w-[50vw] h-max flex flex-col justify-center items-center"
      show={show}
      onClose={onClose}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-10 py-8">
        <div className="absolute top-3 right-5">
          <IconButton
            className="hover:bg-neutral-100"
            onClick={(event) => {
              event.stopPropagation();
              onClose && onClose();
            }}
          >
            <IoClose className="text-3xl text-neutral-500" />
          </IconButton>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-row flex-wrap items-center justify-center size-[100px] bg-primary-100 dark:bg-primary-900/50 rounded-full">
            <FaExclamation className="text-[42px] text-primary-500/80 dark:text-primary-600" />
          </div>

          <div className="font-bold text-2xl text-primary-500 dark:text-primary-500 mt-5">
            {t("Start term")}
          </div>

          <div className="font-semibold dark:font-bold text-primary-400 dark:text-primary-600 mt-5">
            {t("start_term_message.part1")}
            <span className="font-extrabold dark:text-primary-500">
              {t("start_term_message.part2", { termName })}
            </span>
            {t("start_term_message.part3")}
          </div>

          <div className="mt-3 font-semibold dark:font-bold text-primary-400 dark:text-primary-600">
            {t("confirmation_message.part1")}{" "}
            <span className="font-extrabold dark:text-primary-500">
              {t("confirmation_message.part2")}
            </span>{" "}
            {t("confirmation_message.part3")}
          </div>
        </div>

        <div className="mt-10 flex flex-row gap-6 w-full">
          <Button
            variant="tertiary"
            className="font-bold w-[250px] p-3"
            onClick={() => {
              onClose && onClose();
            }}
          >
            {t("No, cancel")}
          </Button>

          <Button
            containerClassName="flex-1"
            className="font-bold p-3"
            onClick={() => {
              if (termId) {
                startTerm({ termId });
              }
            }}
          >
            {t("Yes, start term")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
