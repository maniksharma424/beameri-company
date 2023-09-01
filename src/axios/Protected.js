import { Navigate, Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { isAutheticated } from "../utils/auth";

export const Protected = () => {
  const location = useLocation();
  const isLoggedIn = isAutheticated();
  const navigate = useNavigate();

  return (
    <>
      {isLoggedIn?.token ? (
        <Outlet />
      ) : (
        <Navigate to="/" redirect="/" replace state={{ from: location }} />
      )}
    </>
  );
};
