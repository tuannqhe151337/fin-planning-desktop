import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header";
import { Sidebar } from "../../widgets/sidebar";
import { useLazyMeQuery } from "../../providers/store/api/authApi";
import { useEffect, useState } from "react";
import { LogoutModal } from "../../widgets/logout-modal";
import { changeTheme } from "../../features/theme-changer/utils/change-theme";
import { changeLanguage } from "i18next";
import { useRegisterFCMTokenMutation } from "../../providers/store/api/fcmApi";
import { onMessageListener, requestForToken } from "../../providers/firebase";
import { toast } from "react-toastify";

export const ProtectedRootPage: React.FC = () => {
  // Naviate
  const navigate = useNavigate();

  // Check if user is logged in
  const [getMeQuery, { data: me, isSuccess, isError }] = useLazyMeQuery();

  useEffect(() => {
    getMeQuery();
  }, []);

  useEffect(() => {
    if (isSuccess && me) {
      changeTheme(me.settings.theme);
      changeLanguage(me.settings.language);
    }
  }, [me, isSuccess]);

  useEffect(() => {
    if (isError) {
      navigate("/auth/login");
    }
  }, [isError]);

  // Register FCM Token
  const [registerFcmToken] = useRegisterFCMTokenMutation();

  useEffect(() => {
    if (me) {
      requestForToken().then((fcmToken) => {
        fcmToken && registerFcmToken({ token: fcmToken });
      });
    }
  }, [me]);

  // Listen to notifications
  const [messageId, setMessageId] = useState<string>();

  useEffect(() => {
    onMessageListener().then((payload) => {
      toast(payload.notification?.body, { type: "success" });

      // Set for infinitely listen to message from firebase
      setMessageId(payload.messageId);
    });
  }, [messageId]);

  // Logout modal
  const [isShowLogout, setIsShowLogout] = useState<boolean>(false);

  return (
    <div>
      <Header onLogoutClick={() => setIsShowLogout(true)} />
      <div className="flex flex-row">
        <Sidebar />
        <div className="w-full">
          <Outlet />
        </div>
      </div>

      <LogoutModal show={isShowLogout} onClose={() => setIsShowLogout(false)} />
    </div>
  );
};
