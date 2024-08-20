import { useEffect } from "react";
import { useMeQuery } from "../../providers/store/api/authApi";
import { Role } from "../../providers/store/api/type";
import { useNavigate } from "react-router-dom";

export const usePageAuthorizedForRole = (roles: Role[]) => {
  // Navigate
  const navigate = useNavigate();

  // Get me
  const { data: me } = useMeQuery();

  useEffect(() => {
    if (me && Object.values<string>(Role).includes(me.role.code)) {
      if (roles.findIndex((role) => role === me.role.code) === -1) {
        navigate(`/`);
      }
    }
  }, [me]);
};
