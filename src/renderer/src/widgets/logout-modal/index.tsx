import { IconButton } from "../../shared/icon-button";
import { Modal } from "../../shared/modal";
import { IoClose } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa";
import { Button } from "../../shared/button";
import { authAPI, useLogoutMutation } from "../../providers/store/api/authApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { usersApi } from "../../providers/store/api/usersApi";
import { roleAPI } from "../../providers/store/api/roleApi";
import { departmentAPI } from "../../providers/store/api/departmentApi";
import { positionAPI } from "../../providers/store/api/positionApi";
import { plansApi } from "../../providers/store/api/plansApi";
import { termAPI } from "../../providers/store/api/termApi";
import { annualAPI } from "../../providers/store/api/annualsAPI";
import { statusAPI } from "../../providers/store/api/statusApi";
import { costTypeAPI } from "../../providers/store/api/costTypeAPI";
import { reportsAPI } from "../../providers/store/api/reportsAPI";

interface Props {
  show: boolean;
  onClose: () => any;
}

export const LogoutModal: React.FC<Props> = ({ show, onClose }) => {
  // Navigate
  const navigate = useNavigate();

  // Dispatch
  const dispatch = useDispatch();

  // Logout
  const [logout, { isLoading, isSuccess }] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      localStorage.clear();

      dispatch(authAPI.util.resetApiState());
      dispatch(usersApi.util.resetApiState());
      dispatch(roleAPI.util.resetApiState());
      dispatch(departmentAPI.util.resetApiState());
      dispatch(positionAPI.util.resetApiState());
      dispatch(plansApi.util.resetApiState());
      dispatch(termAPI.util.resetApiState());
      dispatch(annualAPI.util.resetApiState());
      dispatch(statusAPI.util.resetApiState());
      dispatch(costTypeAPI.util.resetApiState());
      dispatch(reportsAPI.util.resetApiState());

      navigate(`/auth/login`);
    }
  }, [isSuccess]);

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
          <div className="font-bold dark:font-extrabold text-2xl text-red-400 dark:text-red-400/60 mt-5">
            Logout
          </div>
          <div className="mt-3 font-semibold dark:font-bold text-red-400 dark:text-red-500">
            Are you sure you want to logout?
          </div>
        </div>

        <div className="mt-10 flex flex-row gap-6 w-full">
          <Button
            disabled={isLoading}
            className="font-bold w-[250px] p-3"
            onClick={() => {
              onClose && onClose();
            }}
          >
            No, cancel
          </Button>
          <Button
            disabled={isLoading}
            containerClassName="flex-1"
            className="p-3"
            variant="error"
            buttonType="outlined"
            onClick={() => {
              logout();
            }}
          >
            {!isLoading && "Log me out"}
            {isLoading && <CgSpinner className="m-auto text-lg animate-spin" />}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
