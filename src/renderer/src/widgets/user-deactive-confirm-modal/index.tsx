import { IconButton } from "../../shared/icon-button";
import { Modal } from "../../shared/modal";
import { IoClose } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa";
import { Button } from "../../shared/button";
import {
  useDeleteUserMutation,
  UserPreview,
} from "../../providers/store/api/usersApi";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  user?: UserPreview;
  show: boolean;
  onClose: () => any;
  onDeactivateSuccessfully?: (user: UserPreview) => any;
}

export const UserDeactiveConfirmModal: React.FC<Props> = ({
  user,
  show,
  onClose,
  onDeactivateSuccessfully,
}) => {
  // Mutation
  const [deleteUser, { isLoading, isError, isSuccess }] =
    useDeleteUserMutation();

  useEffect(() => {
    if (!isLoading && isSuccess && !isError && user) {
      toast("Deactivate user successfully!", { type: "success" });
      onDeactivateSuccessfully && onDeactivateSuccessfully(user);
      onClose && onClose();
    }
  }, [isLoading, isError, isSuccess]);

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
          <div className="flex flex-row flex-wrap items-center justify-center size-[100px] bg-red-100 dark:bg-red-900/50 rounded-full">
            <FaExclamation className="text-[42px] text-red-500/80 dark:text-red-700/80" />
          </div>
          <div className="font-bold dark:font-extrabold text-2xl text-neutral-400 dark:text-neutral-400/60 mt-5">
            Deactivate user
          </div>
          <div className="font-semibold dark:font-bold text-neutral-400 dark:text-neutral-500 mt-5">
            You're going to deactivate user{" "}
            <span className="font-extrabold text-red-500 dark:text-red-600">
              "{user?.username}"
            </span>
            .
          </div>
          <div className="mt-3 font-semibold dark:font-bold text-neutral-400 dark:text-neutral-500">
            Are you sure?
          </div>
        </div>

        <div className="mt-10 flex flex-row gap-6 w-full">
          <Button
            className="font-bold w-[250px] p-3"
            onClick={() => {
              onClose && onClose();
            }}
          >
            No, cancel
          </Button>
          <Button
            containerClassName="flex-1"
            className="p-3"
            variant="error"
            buttonType="outlined"
            onClick={() => {
              if (user?.userId) {
                deleteUser({ id: user.userId });
              }
            }}
          >
            Yes, deactive
          </Button>
        </div>
      </div>
    </Modal>
  );
};
